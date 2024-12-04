import { createOptimizedPicture } from '../../scripts/aem.js'; // Adjust path as necessary

// Select the custom list block container
const articlesContainer = document.querySelector('.article-list.block');

// Function to fetch and return filtered JSON data
async function getDataFromJSON(jsonURL) {
  try {
    const response = await fetch(jsonURL);
    console.log(response);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${jsonURL}`);
    }
    const jsonData = await response.json();
    console.log(jsonData);
    // Filter data to include only those records with template 'magazine'
    const filteredData = jsonData.data.filter((item) => item.template === 'magazine');
    // Map through filtered data to structure it for the UI
    return filteredData.map((item) => ({
      imgSrc: item.image, // URL of the image
      title: item.title, // Title of the article
      description: item.description, // Description of the article
      link: item.path, // Path for the anchor tag
    }));
  } catch (error) {
    throw new Error('Error fetching JSON data');
  }
}

// Function to fetch and display data inside the custom-list block
async function renderCustomList(jsonURL) {
  // Fetch filtered data using helper function
  const data = await getDataFromJSON(jsonURL);

  // Clear existing content in the container
  articlesContainer.innerHTML = '';

  // Create a new unordered list to append items
  const ulElement = document.createElement('ul');

  // Iterate through data and append each item to the DOM
  data.forEach((item) => {
    const listItem = document.createElement('li');

    // Create the image element using createOptimizedPicture
    const imgDiv = document.createElement('div');
    imgDiv.className = 'cards-card-image';
    const imgAnchor = document.createElement('a');
    imgAnchor.href = item.link;

    // Create optimized picture using the existing function
    const pictureElement = createOptimizedPicture(item.imgSrc, item.title);
    console.log(pictureElement);
    imgAnchor.appendChild(pictureElement);
    imgDiv.appendChild(imgAnchor);

    // Create the body section
    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'cards-card-body';

    // Title (button)
    const titleContainer = document.createElement('p');
    titleContainer.className = 'button-container';
    const titleAnchor = document.createElement('a');
    titleAnchor.href = item.link;
    titleAnchor.textContent = item.title;
    titleAnchor.className = 'button';
    titleContainer.appendChild(titleAnchor);

    // Description
    const descriptionP = document.createElement('p');
    descriptionP.textContent = item.description;

    // Append title and description to body
    bodyDiv.appendChild(titleContainer);
    bodyDiv.appendChild(descriptionP);

    // Append both image and body to the list item
    listItem.appendChild(imgDiv);
    listItem.appendChild(bodyDiv);

    // Append list item to the unordered list
    ulElement.appendChild(listItem);
  });

  // Replace the existing anchor tag (JSON link) with the new list
  articlesContainer.appendChild(ulElement);
}

// Find the anchor tag in the block, extract its href, and render the list
export default function decorate(block) {
  console.log(block);
  const dataListAnchor = block.querySelector('a[href$=".json"]');
  console.log(dataListAnchor);
  if (dataListAnchor) {
    const jsonURL = dataListAnchor.href;
    renderCustomList(jsonURL);
  }
}