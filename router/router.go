package router

import (
	"github.com/ivanwang123/email/handlers"
	"github.com/labstack/echo/v4"
)

func Router(e *echo.Echo) {
	msgGroup := e.Group("/message")
	{
		msgGroup.GET("", handlers.ListMessages)
		msgGroup.GET("/:id", handlers.GetMessage)
		msgGroup.POST("/send", handlers.SendMessage)
		msgGroup.POST("/trash/:id", handlers.TrashMessage)
	}
}
