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
                --background: #d3d3d3;
                --input-focus: #2d8cf0;
                --font-color: #323232;
                --font-color-sub: #666;
                --bg-color: #fff;
                --main-color: #323232;
                padding: 20px;
                background: var(--background);
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: center;
                gap: 20px;
                border-radius: 5px;
                border: 2px solid var(--main-color);
                box-shadow: 4px 4px var(--main-color);
            }
            .fr-widget-form > p {
                font-family: var(--font-DelaGothicOne);
                color: var(--font-color);
                font-weight: 700;
                font-size: 20px;
                margin-bottom: 15px;
                display: flex;
                flex-direction: column;
            }
                .fr-widget-form > p > span {
                font-family: var(--font-SpaceMono);
                color: var(--font-color-sub);
                font-weight: 600;
                font-size: 17px;
            }
            .separator {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
            }
            .separator > div {
                width: 100px;
                height: 3px;
                border-radius: 5px;
                background-color: var(--font-color-sub);
            }
            .separator > span {
                color: var(--font-color);
                font-family: var(--font-SpaceMono);
                font-weight: 600;
            }
            .oauthButton {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 5px;
                padding: auto 15px 15px auto;
                width: 250px;
                height: 40px;
                border-radius: 5px;
                border: 2px solid var(--main-color);
                background-color: var(--bg-color);
                box-shadow: 4px 4px var(--main-color);
                font-size: 16px;
                font-weight: 600;
                color: var(--font-color);
                cursor: pointer;
                transition: all 250ms;
                position: relative;
                overflow: hidden;
                z-index: 1;
            }
            .oauthButton::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 0;
                background-color: #212121;
                z-index: -1;
                box-shadow: 4px 8px 19px -3px rgba(0, 0, 0, 0.27);
                transition: all 250ms;
            }
            .oauthButton:hover {
                color: #e8e8e8;
            }
                .oauthButton:hover::before {
                width: 100%;
            }
            .fr-widget-form > input,
            .fr-widget-form > textarea,
            .fr-widget-form > select {
                width: 250px;
                height: 40px;
                border-radius: 5px;
                border: 2px solid var(--main-color);
                background-color: var(--bg-color);
                box-shadow: 4px 4px var(--main-color);
                font-size: 15px;
                font-weight: 600;
                color: var(--font-color);
                padding: 5px 10px;
                outline: none;
            }
            .icon {
                width: 1.5rem;
                height: 1.5rem;
            }
            .notifications-container {
                width: 320px;
                height: auto;
                font-size: 0.875rem;
                line-height: 1.25rem;
                display: flex;
                flex-direction: column;
                gap: 1rem;
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 100001; /* Ensure it appears above other elements */
            }
            .flex {
                display: flex;
            }
            .flex-shrink-0 {
                flex-shrink: 0;
            }
            .success {
                padding: 1rem;
                border-radius: 0.375rem;
                background-color: rgb(240 253 244);
            }
            .succes-svg {
                color: rgb(74 222 128);
                width: 1.25rem;
                height: 1.25rem;
            }
            .success-prompt-wrap {
                margin-left: 0.75rem;
            }
            .success-prompt-heading {
                font-weight: bold;
                color: rgb(22 101 52);
            }
            .success-prompt-prompt {
                margin-top: 0.5rem;
                color: rgb(21 128 61);
            }
            .success-button-container {
                display: flex;
                margin-top: 0.875rem;
                margin-bottom: -0.375rem;
                margin-left: -0.5rem;
                margin-right: -0.5rem;
            }
            .success-button-main {
                padding-top: 0.375rem;
                padding-bottom: 0.375rem;
                padding-left: 0.5rem;
                padding-right: 0.5rem;
                background-color: #ECFDF5;
                color: rgb(22 101 52);
                font-size: 0.875rem;
                line-height: 1.25rem;
                font-weight: bold;
                border-radius: 0.375rem;
                border: none;
            }
            .success-button-main:hover {
                background-color: #D1FAE5;
            }
            .success-button-secondary {
                padding-top: 0.375rem;
                padding-bottom: 0.375rem;
                padding-left: 0.5rem;
                padding-right: 0.5rem;
                margin-left: 0.75rem;
                background-color: #ECFDF5;
                color: #065F46;
                font-size: 0.875rem;
                line-height: 1.25rem;
                border-radius: 0.375rem;
                border: none;
            }
            .success-button-secondary:hover {
                background-color: #D1FAE5;
                color: rgb(22 101 52);
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
        card.className = 'notifications-container';
        card.innerHTML = `
            <div class="${isSuccess ? 'success' : 'error'}">
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="succes-svg">
                        <path clip-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fill-rule="evenodd"></path>
                    </svg>
                </div>
                <div class="success-prompt-wrap">
                    <p class="success-prompt-heading">${isSuccess ? 'Success' : 'Error'}</p>
                    <div class="success-prompt-prompt">
                        <p>${message}</p>
                    </div>
                    <div class="success-button-container">
                        <button class="success-button-main" type="button">${isSuccess ? 'Submit another request' : 'Try again'}</button>
                        <button class="success-button-secondary" type="button">Dismiss</button>
                    </div>
                </div>
            </div>
            </div>
        `;
        document.body.appendChild(card);
    
        card.querySelector('.success-button-main').addEventListener('click', () => {
            this.openModal();
            card.remove();
        });
    
        card.querySelector('.success-button-secondary').addEventListener('click', () => {
            card.remove();
        });
    }

    getModalHTML() {
        const categoryOptions = this.config.categories
            .map(cat => `<option value="${cat}">${cat}</option>`)
            .join('');

            return `

            <form class="fr-widget-form">
                <p>
                    Please, fill out the form below to request a feature.
                    <span>Thank you for helping us improve!</span>
                </p>
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
                <button type="submit" class="oauthButton">Submit Request</button>
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
            this.displayCard('Your request has been submitted.', true);
        } else {
            const errorData = await response.json();
            throw new Error(`Failed to submit request: ${errorData.detail || response.statusText}`);
        }
    } catch (error) {
        this.closeModal();
        this.displayCard('Sorry, your request has not been submitted.', false);
        console.error('Error:', error);
    }
}
}