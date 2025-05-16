            // ================================================
            //Sending messages to Spreadsheet
            //================================================
           
            document.addEventListener('DOMContentLoaded', function() {
                const form = document.getElementById('contactForm');
                const formStatus = document.getElementById('formStatus');
                const submitBtn = document.getElementById('submitBtn');
                
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const originalBtnText = submitBtn.textContent;
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<span class="spinner"></span>Sending...';
                    formStatus.innerHTML = '<p style="color: #666;">Submitting your message...</p>';
            
                    // Convert FormData to URLSearchParams for better mobile compatibility
                    const formData = new URLSearchParams();
                    for(const [key, value] of new FormData(form)) {
                        formData.append(key, value);
                    }
                    formData.append('timestamp', new Date().toISOString());
            
                    fetch('https://script.google.com/macros/s/AKfycbxxK0v77WFONjgNyiw6kKREVthght3MtNnO6WR3BH5_c4Ukd-VBn65hn4FzgQf7Z3y-Rg/exec', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                    .then(response => {
                        if (!response.ok) throw new Error('Network response was not OK');
                        return response.json();
                    })
                    .then(data => {
                        if (data.result === 'success') {
                            formStatus.innerHTML = '<p style="color: green;">Thank you! Message sent successfully.</p>';
                            form.reset();
                        } else {
                            throw new Error(data.error || 'Server processing failed');
                        }
                    })
                    .catch(error => {
                        console.error('Submission Error:', error);
                        const errorMessage = navigator.onLine ? 
                            'Something went wrong. Please try again.' : 
                            'No internet connection. Please check your network.';
                        formStatus.innerHTML = `<p style="color: red;">${errorMessage}</p>`;
                    })
                    .finally(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                        // Clear messages after 5 seconds only on mobile
                        if(/Mobi|Android/i.test(navigator.userAgent)) {
                            setTimeout(() => formStatus.innerHTML = '', 5000);
                        }
                    });
                });
            });