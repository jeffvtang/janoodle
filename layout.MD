User Stories

creator
-Pick potential dates for an event
  -- event name and details
  -- add creator name and email
  --set potential times
    ---STRETCH calendar
  --generate link (unique)
-STRETCH share directly
  --email from form
-Recieve updates
  --enail sent when someone replies

Attendees
-Want to vote on potential dates
  --after recieving link
  --check off dates that work
  --need to input a name + email
-want to modify entry
  --uncheck dates
  --check off new dates

-want to delete entry
  --removes entire entry
  --STRETCH edit name



DATABASE

Events Table
id (url) - PK
name
desc
creator name
creator email

Attendees Table
id (increment) PK
attendee name
attendee email
event_id FK

Times Table
id(increment) PK
event_id FK
Start time (Date)
End time (Date)


Availabilities Table
id (increment) PK
Attendees_id FK
Times_id FK
Boolean (true false) is_available .defaultTO (false)

ROUTES

/home
  load - GET
  create table - POST

