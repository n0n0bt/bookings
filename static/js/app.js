function Prompt() {

    let toast = function (c) {

        const {
            msg = "",
            icon = "success",
            position = "top-end",
        } = c;

        const Toast = Swal.mixin({
            toast: true,
            title: msg,
            position: position,
            showConfirmButton: false,
            icon: icon,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
        Toast.fire({});
    }

    let succes = function (c) {
        const {
            msg = "",
            title = "",
            footer = "",
        } = c;


        Swal.fire({
            icon: "success",
            title: title,
            text: msg,
            footer: footer,
        });
    }

    let error = function (c) {
        const {
            msg = "",
            title = "",
            footer = "",
        } = c;


        Swal.fire({
            icon: "error",
            title: title,
            text: msg,
            footer: footer,
        });
    }

    async function custom(c) {
        const {
            icon = "",
            msg = "",
            title = "",
            showConfirmButton = true,
        } = c;

        const { value: result } = await Swal.fire({
            icon: icon,
            title: title,
            html: msg,
            backdrop: false,
            focusConfirm: false,
            showCancelButton: true,
            showConfirmButton: showConfirmButton,
            willOpen: () => {
                if (c.willOpen !== undefined) {
                    c.willOpen();
                }
            },
            didOpen: () => {
                if (c.didOpen !== undefined) {
                    c.didOpen();
                }
            }
        });
        if (result) {
            if (result.dismiss !== Swal.DismissReason.cancel){
                if (result.value !== "") {
                    if (c.callback !== undefined) {
                        c.callback(result)
                    }
                } else {
                    c.callback(false)
                }
            } else {
                c.callback(false)
            }
        }
    }

    return {
        toast: toast,
        succes: succes,
        error: error,
        custom: custom,
    }
}

function CheckAvailabilityEngine(id) {
  document.getElementById("check-availability-btn").addEventListener("click", function () {
    let html = `
      <form id="check-availability-form" action="" method="post" novalidate class="needs-validation">
        <div class="row">
          <div class="col">
            <div class="row" id="reservation-dates-modal">
              <div class="col">
                <input disabled required class="for-control" type="text" name="start" id="start" placeholder="Arrival">
              </div>
              <div class="col">
                <input disabled required class="for-control" type="text" name="end" id="end" placeholder="Departure">
              </div>
            </div>
          </div>
        </div>
      </form>
      `
    attention.custom({
    msg: html,
    title: "Choose Your dates",

      willOpen: () => {
        const el = document.getElementById("reservation-dates-modal")
        const rp = new DateRangePicker(el, {
          format: "dd-mm-yyyy",
          showOnFocus: true,
          minDate: new Date(),
        })
      },

      didOpen: () => {
        document.getElementById("start").removeAttribute("disabled");
        document.getElementById("end").removeAttribute("disabled");
      },

      callback: function (result) {
        console.log("called");

        let form = document.getElementById("check-availability-form");
        let formData = new FormData(form);
        formData.append("csrf_token", "{{.CSRFToken}}");
        formData.append("room_id",id);

        fetch("/search-availability-json", {
          method: "post",
          body: formData,
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
          }
          return response.json();
        })
        .then(data => {
          if (data.ok) {
            attention.custom({
              icon: "success",
              showConfirmButton: false,
              msg: '<p>Room is available!</p>'
              + '<p><a href="/book-room?id='
              + data.room_id
              + '&s='
              + data.start_date
              + '&e='
              + data.end_date
              + '" class="btn btn-primary">'
              + 'Book now</a></p>',
            });
          } else {
            attention.error({
              msg: "No availability",
            });
          }
        })
        .catch(error => {
          console.error('There has been a problem with your fetch operation:', error);
          attention.error({
            msg: "Error processing request: " + error.message,
          });
        });
      }
    });

  })
}




