// Override Filament's formatting functions
document.addEventListener('DOMContentLoaded', function() {
    if (typeof window.formatters !== 'undefined') {
        // Override money formatter
        window.formatters.money = function(amount, currency) {
            return 'Rp ' + parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        };
        
        // Override date formatter
        window.formatters.date = function(date) {
            return new Date(date).toISOString().split('T')[0];
        };
        
        // Override datetime formatter
        window.formatters.dateTime = function(date) {
            const d = new Date(date);
            return d.toISOString().split('T')[0] + ' ' + 
                   d.toTimeString().split(' ')[0].substring(0, 5);
        };
        
        // Override time formatter
        window.formatters.time = function(time) {
            const d = new Date(time);
            return d.toTimeString().split(' ')[0].substring(0, 5);
        };
    }
});
