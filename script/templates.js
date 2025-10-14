// templates.js
document.addEventListener('DOMContentLoaded', function() {
    displayTemplates();
    setupTemplateEventListeners();
});

function displayTemplates() {
    const templatesSection = document.querySelector('.templates-section');
    const templates = JSON.parse(sessionStorage.getItem('tripTemplates')) || [];
    
    if (templates.length === 0) {
        templatesSection.innerHTML = `
            <div class="no-templates">
                <p>No saved templates yet.</p>
                <p>Save a trip as template to see it here.</p>
            </div>
        `;
        return;
    }
    
    templatesSection.innerHTML = templates.map(template => `
        <div class="templates-item" data-template-id="${template.id}">
            <div class="top">
                <h3 class="template-destination">
                    ${template.destination}
                </h3>
                <a class="del-temp" href="#" data-template-id="${template.id}">Delete</a>
            </div>
            <div class="mid">
                <p class="template-weather"> 
                    ${template.weather.join(', ')}
                </p>
            </div>
            <div class="bottom">
                <a class="view-temp" href="#" data-template-id="${template.id}">View packing list</a>
                <a class="share-temp" href="#" data-template-id="${template.id}">Share template</a>
            </div>
        </div>
    `).join('');
}

function setupTemplateEventListeners() {
    // Delete template buttons
    document.querySelectorAll('.del-temp').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const templateId = this.getAttribute('data-template-id');
            deleteTemplate(templateId);
        });
    });
    
    // View template buttons
    document.querySelectorAll('.view-temp').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const templateId = this.getAttribute('data-template-id');
            viewTemplatePackingList(templateId);
        });
    });
    
    // Share template buttons
    document.querySelectorAll('.share-temp').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const templateId = this.getAttribute('data-template-id');
            shareTemplate(templateId);
        });
    });
}

function deleteTemplate(templateId) {
    const templates = JSON.parse(sessionStorage.getItem('tripTemplates')) || [];
    const updatedTemplates = templates.filter(template => template.id !== templateId);
    
    sessionStorage.setItem('tripTemplates', JSON.stringify(updatedTemplates));
    displayTemplates(); // Refresh the display
}



function viewTemplatePackingList(templateId) {
    const templates = JSON.parse(sessionStorage.getItem('tripTemplates')) || [];
    const template = templates.find(t => t.id === templateId);
    
    window.location.href = '/views/packinglist.html';

}

function shareTemplate(templateId) {
    const templates = JSON.parse(sessionStorage.getItem('tripTemplates')) || [];
    const template = templates.find(t => t.id === templateId);
    
    if (template) {
        const shareText = `Check out my packing template for ${template.destination}! 
Weather: ${template.weather.join(', ')}
Purpose: ${template.travelReason.join(', ')}`;
        
        if (navigator.share) {
            navigator.share({
                title: `My ${template.destination} Template`,
                text: shareText,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Template details copied to clipboard!');
            });
        }
    }
}

