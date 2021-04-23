package main

import (
	"log"

	"github.com/ivanwang123/email/auth"
	"github.com/ivanwang123/email/router"
	"github.com/ivanwang123/email/stores"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	srv, err := auth.NewService()
	if err != nil {
		log.Fatalf("Unable to create service: %v", err)
	}
	store := stores.NewStore(srv)

	e := echo.New()

	e.Pre(middleware.RemoveTrailingSlash())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
		AllowCredentials: true,
	}))

	e.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			c.Set("store", store)
			return next(c)
		}
	})

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	router.Router(e)

	e.Logger.Fatal(e.Start(":8080"))

	// pageToken := ""
	// for {
	// 	messages, err := store.MessageStore.ListMessages(pageToken)
	// 	if err != nil {
	// 		log.Fatalf("Error listing messages: %v", err)
	// 	}
	// 	fmt.Println(len(messages.Messages))
	// 	if messages.NextPageToken == "" {
	// 		break
	// 	}
	// 	pageToken = messages.NextPageToken
	// 	fmt.Printf("Token: %s\n", pageToken)
	// }
}
