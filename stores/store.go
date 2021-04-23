package stores

import "google.golang.org/api/gmail/v1"

type Store struct {
	*MessageStore
}

func NewStore(srv *gmail.Service) *Store {
	return &Store{
		MessageStore: &MessageStore{Srv: srv, User: "me"},
	}
}
