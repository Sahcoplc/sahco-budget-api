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
