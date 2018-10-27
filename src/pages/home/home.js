import { html, LitElement } from '@polymer/lit-element';
import { GitHubService } from '../../services/github-service';
import { TopologyService } from '../../services/topology-service';

class HomePageComponent extends LitElement {
  
  static get properties() {
    return {
      username: {
        type: String
      },
      avatarUrl: {
        type: String
      },
      topology: {
        type: Object
      },
      selectedLanguage: {
        type: String
      },
      selectedProjectIndex: {
        type: Number
      }
    };
  }

  constructor() {
    super();

    // TODO handle defaults
    this.selectedLanguage = 'javascript';
    this.selectedProjectIndex = 0;
    this.selectedRepositoryIndex = 0;
    this.topology = {
      javascript: {
        projects: [{
          repositories: []
        }]
      }
    };

    // testing github by showing user details
    new GitHubService().getUserDetails().then((data) => {
      this.username = data.username;
      this.avatarUrl = data.avatar;
    });

    this.topologyService = new TopologyService();
  }

  // step 1 - populate topology key (language) dropdown 
  connectedCallback() {
    this.getTopologyKeys();
  }

  getTopologyKeys() {
    this.topologyService.getTopologyKeys().then((response) => {
      response.forEach((key) => {
        this.topology = {
          ...this.topology,
          [key]: {
            projects: [{
              repositories: []
            }]
          }
        };
      });
    });
  }
  
  // step 2 - select a language from the topology to get available projects
  getSelectedLanguage(event) {
    const selectElement = event.path[0];
    const selectOptions = Array.from(selectElement.children);   
    const selectedOption = selectOptions[selectElement.selectedIndex];

    if (selectedOption.value !== '') {
      this.selectedLanguage = selectedOption.value;
      
      this.topologyService.getFullTopologyByKey(this.selectedLanguage).then((response) => {
        this.topology = {
          ...this.topology,
          [this.selectedLanguage]: response
        };
      });
    }
  }

  // step 2 - select a project to get available repos
  getSelectedProject(event) {
    const selectElement = event.path[0];
    const selectOptions = Array.from(selectElement.children);   
    const selectedOption = selectOptions[selectElement.selectedIndex];

    if (selectedOption.value !== '') {
      this.selectedProjectIndex = selectElement.selectedIndex - 1;
      // TODO if wild card, fetch from github
    }
  }

  // step 3 - dropdown to browse repos per project
  getSelectedRepository(event) {
    const selectElement = event.path[0];
    const selectOptions = Array.from(selectElement.children);   
    const selectedOption = selectOptions[selectElement.selectedIndex];

    if (selectedOption.value !== '') {
      this.selectedRepositoryIndex = selectElement.selectedIndex - 1;
      this.getIssuesForRepository(this.selectedRepositoryIndex);
    }
  }

  // step 4 - scroll to views issues per repo
  getIssuesForRepository(index) {
    console.log('getIssuesForRepository', index);
  }

  // TODO conditional rendering
  render() {
    const { username, avatarUrl, topology } = this;
    
    console.log('render', topology);

    /* eslint-disable indent */
    return html`

      <img src="${avatarUrl}" alt="${username}"/>
      
      <p>Hello ${username}!</p>

      <hr/>
      
      <h2>Step 1: Pick a language!</h2>

      <select @change="${this.getSelectedLanguage.bind(this)}">
        <option value="">Languages...</option>

        ${Object.keys(topology).map((key) => {
            return html`<option value="${key}">${key}</option>`;
          })
        }                        
      </select>

      <br/>
      <br/>

      <span>Selected Language: ${this.selectedLanguage}<span>
      
      <hr/>

      <h2>Step 2: Pick a project!</h2>
      <select @change="${this.getSelectedProject.bind(this)}">
        <option value="">Projects...</option>

        ${topology[this.selectedLanguage].projects.map((project) => {
            return html`<option value="${project.name}">${project.name}</option>`;
          })
        }                        
      </select>

      <br/>
      <br/>

      <span>Selected Project (idx): ${this.selectedProjectIndex}<span>
          
      <hr/>
      
      <h2>Step 3: Pick a repo!</h2>
      <select @change="${this.getSelectedRepository.bind(this)}">
        <option value="">Repo...</option> 
        
        ${topology[this.selectedLanguage].projects[this.selectedRepositoryIndex].repositories.map((repo) => {
            return html`<option value="${repo}">${repo}</option>`;
          })
        }
      </select>

      <br/>
      <br/>

      <span>Selected Repo (idx): ${this.selectedRepositoryIndex}<span>

      <hr/>

      <h2>Step 4: Find an issue and help out!</h2>
      <p>TODO</p>
      <hr/>

    </div>
  `;
    /* eslint-enable */
  }
}

customElements.define('eve-home-page', HomePageComponent);