import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const elements = {
    datetimePicker: document.querySelector("#datetime-picker"),
    daysValue: document.querySelector("[data-days]"),
    hoursValue: document.querySelector("[data-hours]"),
    minutesValue: document.querySelector("[data-minutes]"),
    secondsValue: document.querySelector("[data-seconds]"),
    startButton: document.querySelector("[data-start]")
};

let userSelectedDate = null; 
let countInterval = null;

elements.startButton.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  minuteIncrement: 1,
  defaultDate: new Date(),
  onOpen() {
    this.setDate(new Date());
  },
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const nowDate = new Date();

    if (nowDate >= selectedDate) {
      iziToast.error({
        position: "topRight",
        title: "error",
        message: "Please choose a date in the future",
      });
      userSelectedDate = null;
      elements.startButton.disabled = true;
    } else {
      userSelectedDate = selectedDate;
      elements.startButton.disabled = false;
    }
  },
};

const fp = flatpickr(elements.datetimePicker, options);
elements.startButton.addEventListener("click", startCountdown);

function startCountdown() {
  if (!userSelectedDate) return;
  elements.startButton.disabled = true;
  elements.datetimePicker.disabled = true;
  if (countInterval) clearInterval(countInterval);

  updateCountdown();
  countInterval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  const nowDate = new Date();
  const timeRemaining = userSelectedDate - nowDate;

  if (timeRemaining <= 0) {
    clearInterval(countInterval);
    displayTime(convertMs(0));
    elements.datetimePicker.disabled = false;
    return;
  }
  displayTime(convertMs(timeRemaining));
}

function displayTime({ days, hours, minutes, seconds }) {
    elements.daysValue.textContent = formatTime(days);
    elements.hoursValue.textContent = formatTime(hours);
    elements.minutesValue.textContent = formatTime(minutes);
    elements.secondsValue.textContent = formatTime(seconds);
}

function formatTime(value) {
  return String(value).padStart(2, "0");
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}