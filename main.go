package main

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/md5"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/mattn/go-sqlite3"
)

type Users struct {
	gorm.Model
	Name string `gorm:"not null" form:"name" json:"name"`
}

type Files struct {
	gorm.Model
	Name    string `gorm:"not null" form:"name" json:"name"`
	Size    int64  `gorm:"not null" form:"size" json:"size"`
	Content []byte `gorm:"not null" form:"content" json:"content"`
	UserID  uint   `gorm:"not null" form:"user_id" json:"user_id"`
	User    Users  `gorm:"not null" form:"user" json:"user"`
}

var PreSetSecret = "amirasdasd"

func InitDb() *gorm.DB {
	db, err := gorm.Open("sqlite3", "./data.db")
	db.LogMode(true)
	if err != nil {
		panic(err)
	}
	if !db.HasTable(&Users{}) {
		db.CreateTable(&Users{})
		db.Set("gorm:table_options", "ENGINE=InnoDB").CreateTable(&Users{})
	}
	if !db.HasTable(&Files{}) {
		db.CreateTable(&Files{})
		db.Set("gorm:table_options", "ENGINE=InnoDB").CreateTable(&Files{})
	}
	return db
}

func createHash(key string) string {
	hasher := md5.New()
	hasher.Write([]byte(key))
	return hex.EncodeToString(hasher.Sum(nil))
}

func encrypt(data []byte, passphrase string) []byte {
	block, _ := aes.NewCipher([]byte(createHash(passphrase)))
	gcm, _ := cipher.NewGCM(block)
	nonce := make([]byte, gcm.NonceSize())
	io.ReadFull(rand.Reader, nonce)
	ciphertext := gcm.Seal(nonce, nonce, data, nil)
	return ciphertext
}

func decrypt(data []byte, passphrase string) []byte {
	key := []byte(createHash(passphrase))
	block, _ := aes.NewCipher(key)
	gcm, _ := cipher.NewGCM(block)
	nonceSize := gcm.NonceSize()
	nonce, ciphertext := data[:nonceSize], data[nonceSize:]
	plaintext, _ := gcm.Open(nil, nonce, ciphertext, nil)
	return plaintext
}

func main() {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowMethods:     []string{"PUT", "POST", "DELETE", "GET"},
		AllowHeaders:     []string{"Origin", "content-type", "auth"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return origin == "http://localhost:3000"
		},
	}))
	v1 := r.Group("v1")
	{
		v1.POST("/login", Login)
		v1.GET("/users", GetUsers)
		v1.PUT("/files", Upload)
		v1.GET("/files", GetAllFilesByUserId)
		v1.GET("/files/:file-id", GetDecryptedFile)
		v1.DELETE("files/:file-id", DeleteFile)
		v1.POST("/files/share", Share)
	}
	r.Run(":8080")
}

func DeleteFile(c *gin.Context) {
	db := InitDb()
	defer db.Close()
	fileId := c.Param("file-id")
	db.Delete(&Files{}, fileId)
}

func GetDecryptedFile(c *gin.Context) {
	db := InitDb()
	defer db.Close()
	fileId := c.Param("file-id")
	UserId, err := c.Cookie("user_id")
	userId, _ := strconv.Atoi(UserId)
	var file Files
	db.Where("id = ?", fileId).First(&file)
	temp := decrypt(file.Content, PreSetSecret)
	err = ioutil.WriteFile(file.Name, temp, 0644)
	if err != nil {
		fmt.Println(err)
		c.String(http.StatusBadRequest, fmt.Sprintln("file not exicts"))

	}
	if file.UserID != uint(userId) {
		os.Remove(file.Name)
		c.String(http.StatusBadRequest, fmt.Sprintln("This is not your file!"))
	} else {
		http.ServeFile(c.Writer, c.Request, file.Name)
		os.Remove(file.Name)
	}

}

func Upload(c *gin.Context) {
	// single file
	db := InitDb()
	defer db.Close()
	var user Users

	UserId, err := c.Cookie("user_id")
	userId, _ := strconv.Atoi(UserId)

	db.Where("id = ?", UserId).First(&user)

	file, err := c.FormFile("file")
	if err != nil {
		fmt.Println("error", err)
	}
	if file != nil {
		fmt.Println("error", err)
		fileContent, _ := file.Open()
		byteContainer, err := ioutil.ReadAll(fileContent)
		content := encrypt(byteContainer, PreSetSecret)
		fmt.Println("file name " + file.Filename)
		fmt.Println(user)
		db.Create(&Files{Name: file.Filename, Content: content, UserID: uint(userId), Size: file.Size})
		if err != nil {
			fmt.Println(err)
			c.JSON(422, gin.H{"error": "Fields are empty"})
			return
		}
		c.JSON(200, file)
	} else {
		c.String(http.StatusBadRequest, fmt.Sprintln("somethig went wrong!"))

	}
}

func Login(c *gin.Context) {
	db := InitDb()
	defer db.Close()
	var user Users
	c.Bind(&user)

	if user.Name != "" {
		db.Where("name = ?", user.Name).First(&user)
		if user.ID == 0 {
			db.Create(&user)
			var n uint = user.ID
			var s string = strconv.FormatUint(uint64(n), 10)
			c.SetCookie("user_id", s, 3600, "/", "localhost", false, true)
		} else {
			var n uint = user.ID
			var s string = strconv.FormatUint(uint64(n), 10)
			c.SetCookie("user_id", s, 3600, "/", "localhost", false, true)
		}
	} else {
		c.JSON(422, gin.H{"error": "Fields are empty"})
	}
}

func GetAllFilesByUserId(c *gin.Context) {
	db := InitDb()
	defer db.Close()
	var files []Files
	UserId, err := c.Cookie("user_id")
	if err != nil {
		fmt.Println(err)
	}
	userId, _ := strconv.Atoi(UserId)
	//Select([]string{"name", "age"})
	db.Where("user_id = ?", uint(userId)).Select([]string{"size", "ID", "name", "created_at", "updated_at"}).Find(&files)
	c.JSON(200, files)

}

func GetUsers(c *gin.Context) {
	db := InitDb()
	defer db.Close()
	var users []Users
	db.Find(&users)
	c.JSON(200, users)
}

func Share(c *gin.Context) {
	c.String(200, fmt.Sprintln(""))
}
