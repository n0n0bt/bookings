package dbrepo

import (
	"database/sql"
	"errors"
	"time"

	"github.com/n0n0bt/bookings/internal/config"
	"github.com/n0n0bt/bookings/internal/repository"
)

type postgresDBRepo struct {
	App *config.AppConfig
	DB  *sql.DB
}

type testDBRepo struct {
	App                   *config.AppConfig
	DB                    *sql.DB
	shouldReturnAvailable bool // Control availability response
	shouldReturnError     bool // Control error simulation
}

func NewPostgresRepo(conn *sql.DB, a *config.AppConfig) repository.DatabaseRepo {
	return &postgresDBRepo{
		App: a,
		DB:  conn,
	}
}

func NewTestingRepo(a *config.AppConfig) repository.DatabaseRepo {
	return &testDBRepo{
		App: a,
	}
}

func (m *testDBRepo) SearchAvailabilityByDatesByRoomID(start, end time.Time, roomID int) (bool, error) {
	if m.shouldReturnError {
		return false, errors.New("simulated database error")
	}
	return m.shouldReturnAvailable, nil
}
