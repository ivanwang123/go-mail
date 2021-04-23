package handlers

import (
	"fmt"
	"net/http"

	"github.com/ivanwang123/email/stores"
	"github.com/labstack/echo/v4"
)

type Res map[string]interface{}

type SendMsgReq struct {
	To      string `json:"to"`
	Subject string `json:"subject"`
	Body    string `json:"body"`
}

func ListMessages(c echo.Context) error {
	store := c.Get("store").(*stores.Store)

	pageToken := c.QueryParam("page-token")
	messages, pageToken, err := store.MessageStore.ListMessages(pageToken)
	if err != nil {
		fmt.Println(err)
		return echo.NewHTTPError(http.StatusInternalServerError, "Unable to retrieve messages")
	}

	return c.JSON(http.StatusOK, &Res{
		"alert":     "Successfully retrieved messages",
		"messages":  messages,
		"pageToken": pageToken,
	})
}

func GetMessage(c echo.Context) error {
	store := c.Get("store").(*stores.Store)

	id := c.Param("id")

	msg, err := store.MessageStore.GetMessage(id)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Unable to get message")
	}

	return c.JSON(http.StatusOK, &Res{
		"alert":   "Successfully retrieved message",
		"message": msg,
	})
}

func SendMessage(c echo.Context) error {
	store := c.Get("store").(*stores.Store)

	reqBody := &SendMsgReq{}
	err := c.Bind(reqBody)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Incorrect message format")
	}

	err = store.MessageStore.SendMessage(reqBody.To, reqBody.Subject, reqBody.Body)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Unable to send message")
	}

	return c.JSON(http.StatusOK, &Res{
		"alert": "Successfully sent message",
	})
}

func TrashMessage(c echo.Context) error {
	store := c.Get("store").(*stores.Store)

	id := c.Param("id")

	err := store.MessageStore.TrashMessage(id)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Unable to trash message")
	}

	return c.JSON(http.StatusOK, &Res{
		"alert": "Successfully moved message to trash",
	})
}
