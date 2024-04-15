document.addEventListener('DOMContentLoaded', () => {
    const quoteList = document.getElementById('quote-list');
    const newQuoteForm = document.getElementById('new-quote-form');

    // Function to fetch quotes from the API and display them
    function fetchQuotes() {
        fetch('http://localhost:3000/quotes?_embed=likes')
            .then(response => response.json())
            .then(quotes => {
                quotes.forEach(quote => {
                    renderQuote(quote);
                });
            })
            .catch(error => console.error('Error fetching quotes:', error));
    }

    // Function to render a single quote item
    function renderQuote(quote) {
        const quoteItem = document.createElement('li');
        quoteItem.classList.add('quote-card');
        quoteItem.innerHTML = `
            <blockquote class="blockquote">
                <p class="mb-0">${quote.quote}</p>
                <footer class="blockquote-footer">${quote.author}</footer>
                <br>
                <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
                <button class='btn-danger'>Delete</button>
            </blockquote>
        `;
        quoteList.appendChild(quoteItem);

        // Add event listener for like button
        const likeButton = quoteItem.querySelector('.btn-success');
        likeButton.addEventListener('click', () => {
            likeQuote(quote);
        });

        // Add event listener for delete button
        const deleteButton = quoteItem.querySelector('.btn-danger');
        deleteButton.addEventListener('click', () => {
            deleteQuote(quote, quoteItem);
        });
    }

    // Function to like a quote
    function likeQuote(quote) {
        const newLike = { quoteId: quote.id };

        fetch('http://localhost:3000/likes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newLike)
        })
        .then(response => response.json())
        .then(() => {
            const likeButton = quoteList.querySelector(`[data-id="${quote.id}"] .btn-success`);
            const likeCount = likeButton.querySelector('span');
            likeCount.textContent = parseInt(likeCount.textContent) + 1;
        })
        .catch(error => console.error('Error liking quote:', error));
    }

    // Function to delete a quote
    function deleteQuote(quote, quoteItem) {
        fetch(`http://localhost:3000/quotes/${quote.id}`, {
            method: 'DELETE'
        })
        .then(() => {
            quoteItem.remove();
        })
        .catch(error => console.error('Error deleting quote:', error));
    }

    // Event listener for new quote form submission
    newQuoteForm.addEventListener('submit', event => {
        event.preventDefault();
        const formData = new FormData(newQuoteForm);
        const quote = formData.get('quote');
        const author = formData.get('author');
        const newQuote = { quote, author };

        fetch('http://localhost:3000/quotes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newQuote)
        })
        .then(response => response.json())
        .then(quote => {
            renderQuote(quote);
            newQuoteForm.reset();
        })
        .catch(error => console.error('Error adding new quote:', error));
    });

    // Initial fetch of quotes
    fetchQuotes();
});
