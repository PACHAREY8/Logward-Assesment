module.exports = {
    returnDate() {
        let currentdate = new Date();
        return `${currentdate.toLocaleDateString()}T${currentdate.toLocaleTimeString()}`;
    },
    sortDateNTIme(data) {
        return data.sort(function (a, b) {
            return b.dateNTime > a.dateNTime;
        })
    }
}