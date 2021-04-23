package stores

import (
	"encoding/base64"
	"fmt"
	"sort"

	"google.golang.org/api/gmail/v1"
)

type MessageStore struct {
	Srv  *gmail.Service
	User string
}

func (s *MessageStore) ListMessages(nextPageToken string) ([]*gmail.Message, string, error) {
	msgReq := s.Srv.Users.Messages.List(s.User)
	msgReq.MaxResults(50)
	if nextPageToken != "" {
		msgReq.PageToken(nextPageToken)
	}
	msgs, err := msgReq.Do()
	if err != nil {
		return nil, "", err
	}

	type result struct {
		idx     int
		message *gmail.Message
		err     error
	}
	resultCh := make(chan result)

	for i, m := range msgs.Messages {
		go func(idx int, id string) {
			msg, err := s.GetMessage(id)
			if err != nil {
				resultCh <- result{idx: idx, err: err}
			}
			resultCh <- result{idx: idx, message: msg}
		}(i, m.Id)
	}

	var results []result
	for i := 0; i < len(msgs.Messages); i++ {
		results = append(results, <-resultCh)
	}
	sort.Slice(results, func(a, b int) bool {
		return results[a].idx < results[b].idx
	})

	var messages []*gmail.Message
	for _, res := range results {
		if res.err != nil {
			continue
		}
		messages = append(messages, res.message)
	}

	return messages, msgs.NextPageToken, nil
}

func (s *MessageStore) GetMessage(msgId string) (*gmail.Message, error) {
	msg, err := s.Srv.Users.Messages.Get(s.User, msgId).Do()
	if err != nil {
		return nil, err
	}
	return msg, nil
}

func (s *MessageStore) SendMessage(to, subject, body string) error {
	var message gmail.Message
	msgBytes := []byte(fmt.Sprintf("To: %s\nSubject: %s\n\n%s", to, subject, body))

	message.Raw = base64.StdEncoding.EncodeToString(msgBytes)
	_, err := s.Srv.Users.Messages.Send(s.User, &message).Do()
	if err != nil {
		return err
	}
	return nil
}

func (s *MessageStore) TrashMessage(msgId string) error {
	_, err := s.Srv.Users.Messages.Trash(s.User, msgId).Do()
	if err != nil {
		return err
	}
	return nil
}
