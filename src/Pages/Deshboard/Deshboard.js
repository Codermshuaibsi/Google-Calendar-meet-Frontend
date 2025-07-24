import React, { useEffect, useState } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({ title: "", time: "", attendee: "" });

  const email = new URLSearchParams(window.location.search).get("email");

  useEffect(() => {
    fetchEvents();
  }, [email]);

  const fetchEvents = async () => {
    const res = await axios.get("https://google-calendar-meet-backend.onrender.com/calendar/events", {
      headers: { email },
    });

    const formatted = res.data.map((event) => ({
      id: event.id,
      title: event.summary,
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      meetLink:
        event.hangoutLink ||
        event?.conferenceData?.entryPoints?.find(
          (ep) => ep.entryPointType === "video"
        )?.uri,
    }));
    setEvents(formatted);
  };

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateEvent = async () => {
    if (!formData.title || !formData.time || !formData.attendee)
      return alert("Please fill all fields");

    const event = {
      summary: formData.title,
      start: {
        dateTime: `${selectedDate}T${formData.time}:00`,
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: `${selectedDate}T${formData.time}:00`,
        timeZone: "Asia/Kolkata",
      },
      attendees: [
        { email: formData.attendee },
      ],
      conferenceData: {
        createRequest: {
          requestId: uuidv4(),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    try {
      await axios.post("https://google-calendar-meet-backend.onrender.com/create/event", {
        email,
        event,
      });
      alert("✅ Event Created!");
      setFormData({ title: "", time: "", attendee: "" });
      setSelectedDate(null);
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create event");
    }
  };

  const handleInstantMeeting = async () => {
    const now = new Date();
    const end = new Date(now.getTime() + 30 * 60000);

    const event = {
      summary: "Instant Meeting",
      start: {
        dateTime: now.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      conferenceData: {
        createRequest: {
          requestId: uuidv4(),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    try {
      const res = await axios.post("https://google-calendar-meet-backend.onrender.com/create/event", {
        email,
        event,
      });

      const created = res.data?.data;
      const meetLink =
        created.hangoutLink ||
        created?.conferenceData?.entryPoints?.find(
          (ep) => ep.entryPointType === "video"
        )?.uri;

      if (meetLink) {
        window.open(meetLink, "_blank");
      } else {
        alert("Meeting link not found");
      }

      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to create instant meeting");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!eventId) return alert("Invalid event ID");
    try {
      await axios.delete(`https://google-calendar-meet-backend.onrender.com/delete/event/${eventId}`, {
        headers: { email },
      });
      alert("🗑️ Event Deleted!");
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to delete event");
    }
  };

  const renderEventContent = (eventInfo) => {
    const eventId = eventInfo.event._def.publicId;
    return (
      <div className="flex justify-between items-center bg-indigo-100 px-3 py-1 rounded shadow-md hover:scale-[1.01] transition">
        <span className="font-medium text-indigo-800 truncate">
          {eventInfo.event.title}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteEvent(eventId);
          }}
          className="text-red-500 hover:text-red-700"
        >
          ✖
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-6 font-inter">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-indigo-700 mb-6 drop-shadow">
          📅 My Smart Calendar
        </h2>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            dateClick={handleDateClick}
            eventContent={renderEventContent}
            height="auto"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,dayGridWeek,dayGridDay",
            }}
          />
        </div>

        <AnimatePresence>
          {selectedDate && (
            <motion.div
              className="fixed top-24 left-1/2 -translate-x-1/2 bg-white bg-opacity-90 backdrop-blur-md border border-indigo-200 shadow-2xl rounded-xl p-6 z-50 w-[320px]"
            >
              <h4 className="text-xl font-semibold mb-4 text-indigo-600 text-center">
                ✏️ New Event on {selectedDate}
              </h4>
              <input
                type="text"
                name="title"
                placeholder="Event Title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full mb-3 px-4 py-2 border border-indigo-200 rounded focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full mb-3 px-4 py-2 border border-indigo-200 rounded focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              <input
                type="email"
                name="attendee"
                placeholder="Attendee Email"
                value={formData.attendee}
                onChange={handleInputChange}
                className="w-full mb-4 px-4 py-2 border border-indigo-200 rounded focus:ring-2 focus:ring-indigo-400 outline-none"
              />

              <div className="flex justify-between">
                <button
                  onClick={handleCreateEvent}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition"
                >
                  ➕ Create
                </button>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg transition"
                >
                  ✖ Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 flex justify-center">
          <button
            onClick={handleInstantMeeting}
            className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white px-6 py-3 rounded-xl shadow-lg text-lg font-semibold transition transform hover:scale-105"
          >
            🚀 Start Instant Meeting
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
