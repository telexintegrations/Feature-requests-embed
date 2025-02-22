// feature-request-widget.js
class FeatureRequestWidget {
    constructor(config) {
        this.config = {
            telexEndpoint: config.telexEndpoint,
            webhookUrl: config.webhookUrl,
            categories: config.categories?.split(',') || [
                'UI/UX',
                'Performance',
                'Security',
                'Integration',
                'Other'
            ],
            position: config.position || 'bottom-right'
        };
        this.isOpen = false;
        this.init();
    }

    init() {
        // Create and inject styles
        const styles = `
            .fr-widget-trigger {
                position: fixed;
                padding: 12px 24px;
                background: #007bff;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-family: system-ui;
                z-index: 99999;
            }
            .fr-widget-modal {
                display: none;
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 24px;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                width: 90%;
                max-width: 500px;
                z-index: 100000;
            }
            .fr-widget-overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 99999;
            }
            .fr-widget-form {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
            .fr-widget-form input,
            .fr-widget-form textarea,
            .fr-widget-form select {
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-family: system-ui;
            }
            .fr-widget-form button {
                padding: 12px;
                background: #007bff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            .fr-widget-close {
                position: absolute;
                top: 12px;
                right: 12px;
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
            }
            .card {
                width: 320px;
                height: fit-content;
                background: #d3d3d3;
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
                z-index: 100001; 
            }
            .text-content {
                width: 100%;
                display: flex;
                flex-direction: column;
                padding: 15px 18px;
                gap: 3px;
            }
            .card-heading {
                font-size: 1em;
                font-weight: 800;
            }
            .card-content {
                font-size: 0.95em;
                font-weight: 500;
                color: rgb(49, 49, 49);
            }
            .exit-btn {
                position: absolute;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: transparent;
                border: none;
                right: 8px;
                top: 8px;
                cursor: pointer;
            }
            .exit-btn svg {
                width: 12px;
            }
            .exit-btn:hover {
                background-color: #eadaba;
            }
            .card::before {
                content: "";
                background-color: #323232;
                width: 100%;
                height: 100%;
                position: absolute;
                z-index: -1;
                padding: 4px;
                transition: all 0.3s;
            }
                .card:hover::before {
                margin: 25px 0 0 25px;
            }
    }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        // Create trigger button
        this.trigger = document.createElement('button');
        this.trigger.className = 'fr-widget-trigger';
        this.trigger.textContent = '💡 Request Feature';
        this.setPosition(this.config.position);
        document.body.appendChild(this.trigger);

        // Create modal
        this.modal = document.createElement('div');
        this.modal.className = 'fr-widget-modal';
        this.modal.innerHTML = this.getModalHTML();
        document.body.appendChild(this.modal);

        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'fr-widget-overlay';
        document.body.appendChild(this.overlay);

        // Add event listeners
        this.trigger.addEventListener('click', () => this.openModal());
        this.modal.querySelector('.fr-widget-close').addEventListener('click', () => this.closeModal());
        this.overlay.addEventListener('click', () => this.closeModal());
        this.modal.querySelector('form').addEventListener('submit', (e) => this.handleSubmit(e));
    }

    displayCard(message, isSuccess) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="text-content">
                <p class="card-heading">${isSuccess ? 'Success' : 'Error'}</p>
                <p class="card-content">${message}</p>
                <button class="exit-btn">
                    <svg fill="none" viewBox="0 0 15 15" height="15" width="15">
                        <path stroke-linecap="round" stroke-width="2" stroke="black" d="M1 14L14 1"></path>
                        <path stroke-linecap="round" stroke-width="2" stroke="black" d="M1 1L14 14"></path>
                    </svg>
                </button>
            </div>
        `;
        document.body.appendChild(card);
    
        card.querySelector('.exit-btn').addEventListener('click', () => {
            card.remove();
        });
    
        setTimeout(() => {
            card.remove();
        }, 5000); // Automatically remove the card after 5 seconds
    }

    getModalHTML() {
        const categoryOptions = this.config.categories
            .map(cat => `<option value="${cat}">${cat}</option>`)
            .join('');

        return `
            <button class="fr-widget-close">&times;</button>
            <h2 style="margin-top: 0;">Request a Feature</h2>
            <form class="fr-widget-form">
                <input type="text" name="title" placeholder="Feature title" required>
                <textarea name="description" placeholder="Describe the feature you'd like to see..." rows="4" required></textarea>
                <input type="email" name="email" placeholder="Your email" required>
                <select name="priority" required>
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                </select>
                <select name="category" required>
                    ${categoryOptions}
                </select>
                <button type="submit">Submit Request</button>
            </form>
        `;
    }

    setPosition(position) {
        const positions = {
            'bottom-right': { bottom: '20px', right: '20px' },
            'bottom-left': { bottom: '20px', left: '20px' },
            'top-right': { top: '20px', right: '20px' },
            'top-left': { top: '20px', left: '20px' }
        };
        Object.assign(this.trigger.style, positions[position] || positions['bottom-right']);
    }

    openModal() {
        this.modal.style.display = 'block';
        this.overlay.style.display = 'block';
        this.isOpen = true;
    }

    closeModal() {
        this.modal.style.display = 'none';
        this.overlay.style.display = 'none';
        this.isOpen = false;
    }

    async handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const data = {
            title: form.title.value,
            description: form.description.value,
            requester_email: form.email.value,
            priority: form.priority.value,
            category: form.category.value,
            webhook_url: this.config.webhookUrl
        };
    
        console.log('Submitting data:', data); // For debugging
    
        try {
            const response = await fetch(this.config.telexEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
    
            if (response.ok) {
                form.reset();
            this.closeModal();
            this.displayCard('Your request has been submitted. Submit another request.', true);
        } else {
            const errorData = await response.json();
            throw new Error(`Failed to submit request: ${errorData.detail || response.statusText}`);
        }
    } catch (error) {
        this.closeModal();
        this.displayCard('Sorry, your request has not been submitted. Try again.', false);
        console.error('Error:', error);
    }
}
}