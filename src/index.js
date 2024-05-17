document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:3000/dogs';
    const tableBody = document.getElementById('table-body');
    const form = document.getElementById('dog-form');
    let editingDogId = null;
  
    // Fetch and render dogs
    const fetchDogs = () => {
      fetch(apiUrl)
        .then(response => response.json())
        .then(dogs => renderDogs(dogs))
        .catch(error => console.error('Error fetching dogs:', error));
    };
  
    // Render dogs in the table
    const renderDogs = (dogs) => {
      tableBody.innerHTML = '';
      dogs.forEach(dog => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${dog.name}</td>
          <td>${dog.breed}</td>
          <td>${dog.sex}</td>
          <td><button class="edit-button" data-id="${dog.id}">Edit</button></td>
        `;
        tableBody.appendChild(row);
      });
    };
  
    // Handle form submission
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = form.elements['name'].value;
      const breed = form.elements['breed'].value;
      const sex = form.elements['sex'].value;
  
      if (editingDogId) {
        fetch(`${apiUrl}/${editingDogId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, breed, sex }),
        })
        .then(() => {
          editingDogId = null;
          form.reset();
          fetchDogs();
        })
        .catch(error => console.error('Error updating dog:', error));
      }
    });
  
    // Populate form with dog details for editing
    tableBody.addEventListener('click', (event) => {
      if (event.target.classList.contains('edit-button')) {
        const dogId = event.target.dataset.id;
        const row = event.target.closest('tr');
        const name = row.children[0].textContent;
        const breed = row.children[1].textContent;
        const sex = row.children[2].textContent;
  
        form.elements['name'].value = name;
        form.elements['breed'].value = breed;
        form.elements['sex'].value = sex;
  
        editingDogId = dogId;
      }
    });
  
    // Initial fetch of dogs
    fetchDogs();
  });
  