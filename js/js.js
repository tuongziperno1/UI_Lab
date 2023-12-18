class TabsGroup extends HTMLElement {
    constructor() {
      super();
      this.tabs = this.querySelectorAll('[role="tab"]');
      this.panels = this.querySelectorAll('[role="tabpanel"]');
    }

    get selected() {
      return this.querySelector('[role="tab"][aria-selected="true"]');
    }

    set selected(element) {
      this.selected?.setAttribute('aria-selected', 'false');
      element?.setAttribute('aria-selected', 'true');
      element?.focus();
      this.updateSelected();
    }

    connectedCallback() {
      this.setIds();
      this.updateSelected();
      this.initEvents();
    }

    setIds() {
      this.tabs.forEach((tab, index) => {
        const panel = this.panels[index];

        tab.id ||= `tab-${index}`;
        panel.id ||= `panel-${index}`;

        tab.setAttribute('aria-controls', panel.id);
        panel.setAttribute('aria-labelledby', tab.id);
      });
    }

    updateSelected() {
      this.tabs.forEach((tab, index) => {
        const panel = this.panels[index];
        const isSelected = tab.getAttribute('aria-selected') === 'true';

        tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        tab.setAttribute('tabindex', isSelected ? '0' : '-1');
        panel.setAttribute('tabindex', isSelected ? '0' : '-1');
        panel.hidden = !isSelected;
      });
    }

    initEvents() {
      this.tabs.forEach((tab) => {
        tab.addEventListener('click', () => this.selected = tab);

        tab.addEventListener('keydown', (event) => {
          if (event.key === 'ArrowLeft') {
            this.selected = tab.previousElementSibling ?? this.tabs.at(-1);
          } else if (event.key === 'ArrowRight') {
            this.selected = tab.nextElementSibling ?? this.tabs.at(0);
          }
        });
      });
    }
  }

  customElements.define('tabs-group', TabsGroup);