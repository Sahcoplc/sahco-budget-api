export const addHoursToDate = (dateObj, hours) => {
  return new Date(dateObj.getTime() + (hours * 60 * 60 * 1000));
};

Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() +
               (h * 60 * 60 * 1000));
  return this;
}

export const formatDate = (date) => {
  // dd/mm/yyyy date format is expected
  if (!date) {
    return null;
  }
  const dateSplit = date.split("/");
  return new Date(dateSplit[2], dateSplit[1], dateSplit[0]);
};

export const fancyDateNoTime = date => {
  const date_ = new Date(date)
    .toLocaleString()
    .replace(/\//g, '-')
    .split(',')[0].split('-').reverse().join('-');
  
  return `${date_}`;
};

export const _showTimeStamp = timeStamp => {
  const date = new Date(timeStamp).toLocaleDateString().replace(/\//g, '-');
  const newTime = new Date(timeStamp).toLocaleTimeString().split(':');
  let hour = parseInt(newTime[0]) - 1;
  // const ampm = hour >= 12 ? 'PM' : 'AM';
  let time = `${hour}:${newTime[1]}`;
  return { date, time };
};
