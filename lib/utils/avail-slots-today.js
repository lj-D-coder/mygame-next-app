async function getAvailableSlots(openTimeStr, closeTimeStr, gameLength, requestTime) {
  // Convert the opening and closing times to hours and minutes
  var openTimeParts = openTimeStr.split(/[:\s]/);
  var openHour = parseInt(openTimeParts[0]);
  openHour = openHour === 12 ? 0 : openHour; // Adjust for 12 AM and 12 PM
  openHour += openTimeParts[2] === "PM" ? 12 : 0;
  var openMinute = parseInt(openTimeParts[1]);

  var closeTimeParts = closeTimeStr.split(/[:\s]/);
  var closeHour = parseInt(closeTimeParts[0]);
  closeHour = closeHour === 12 ? 0 : closeHour; // Adjust for 12 AM and 12 PM
  closeHour += closeTimeParts[2] === "PM" ? 12 : 0;
  var closeMinute = parseInt(closeTimeParts[1]);

  // Create a Date object for the open time
  var openTime = new Date(requestTime.getTime());
  openTime.setHours(openHour, openMinute, 0, 0);

  // Create a Date object for the close time
  var closeTime = new Date(requestTime.getTime());
  closeTime.setHours(closeHour, closeMinute, 0, 0);

  // If the request time is before the open time, start from the open time
  if (requestTime < openTime) {
    requestTime = openTime;
  }

  // If the request time is after the close time, there are no available slots
  if (requestTime > closeTime) {
    return [];
  }

  // Calculate the start of the next slot
  var nextSlotStart = new Date(requestTime.getTime());
  nextSlotStart.setMinutes(Math.ceil(requestTime.getMinutes() / gameLength) * gameLength, 0, 0);

  // Calculate the available slots
  var availableSlots = [];
  while (
    nextSlotStart < closeTime
  ) {
    var nextSlotEnd = new Date(nextSlotStart.getTime() + gameLength * 60 * 1000);
    if (nextSlotEnd > closeTime) {
      break;
    }
    availableSlots.push({
      startTime: nextSlotStart.toLocaleTimeString(),
      endTime: nextSlotEnd.toLocaleTimeString(),
    });
    nextSlotStart = nextSlotEnd;
  }

  return availableSlots;
}



  
  export default getAvailableSlots;
  






  // //returns available slots for today from current time

// async function getAvailableSlots(openTimeStr, closeTimeStr, gameLength, requestTime) {
//     try {
        
//     } catch (error) {
        
//     }
//   // Convert the opening and closing times to hours and minutes
//   var openTimeParts = openTimeStr.split(/[:\s]/);
//   var openHour = parseInt(openTimeParts[0]) + (openTimeParts[2] === "PM" ? 12 : 0);
//   var openMinute = parseInt(openTimeParts[1]);

//   var closeTimeParts = closeTimeStr.split(/[:\s]/);
//   var closeHour = parseInt(closeTimeParts[0]) + (closeTimeParts[2] === "PM" ? 12 : 0);
//   var closeMinute = parseInt(closeTimeParts[1]);

//   // Calculate the start of the next slot
//   var nextSlotStart = new Date(requestTime.getTime());
//   nextSlotStart.setMinutes(Math.ceil(requestTime.getMinutes() / gameLength) * gameLength, 0, 0);

//   // Calculate the available slots
//   var availableSlots = [];
//   while (
//     nextSlotStart.getHours() < closeHour ||
//     (nextSlotStart.getHours() === closeHour && nextSlotStart.getMinutes() < closeMinute)
//   ) {
//     var nextSlotEnd = new Date(nextSlotStart.getTime() + gameLength * 60 * 1000);
//     if (
//       nextSlotEnd.getHours() > closeHour ||
//       (nextSlotEnd.getHours() === closeHour && nextSlotEnd.getMinutes() > closeMinute)
//     ) {
//       break;
//     }
//     availableSlots.push({
//       startTime: nextSlotStart.toLocaleTimeString(),
//       endTime: nextSlotEnd.toLocaleTimeString(),
//     });
//     nextSlotStart = nextSlotEnd;
//   }

//   return availableSlots;
// }

// Usage:
// getAvailableSlots("9:00 AM", "5:00 PM", 60).then(availableSlots => {
//     console.log(availableSlots);
// });

//export default getAvailableSlots;