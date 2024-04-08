package repository

import (
	"time"

	"github.com/n0n0bt/bookings/internal/models"
)

type DatabaseRepo interface {
	AllUsers() bool

	InsertReservation(res models.Reservation) (int, error)
	InsertRoomRestriction(r models.RoomRestriction) error
	SearchAvalabilityByDates(start, end time.Time, roomID int) (bool, error)
}
