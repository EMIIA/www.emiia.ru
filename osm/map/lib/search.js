L.Control.Search = L.Control.extend({
  options: {
    
    placeholder:'Cerca una località...', 
    // Text to show in the search plugin

    icon: 'fa fa-search', //undefined, 
    // Search element to show, alternatives:  or 'searchImage'

    infoField: function(content){
      return content.display_name;
    },
    // Details shown in the result window for each result

    maxResult: 5, 
    // Max number of results that can be shown = 50
    
    viewbox: false, 
    // If true, set extension current map. The reuslts in the current map extensions are preffered by the research.

    bounded: false, 
    // If true, find results just inside the viewbox.

    countrycode: undefined, 
    // Search inside a specific nation, use codes at: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
    
    emptyResult: "Nessun risultato trovato",  
    // Message no result
    
  },

  initialize: function(options) {
    L.setOptions(this, options);
  },

  // Create list of results after the request
  results: [],

  onAdd: function(map) {
    this._map = map;

    var search = L.DomUtil.create('div', 'leaflet-search-group');
    search.setAttribute('aria-atomic', 'true');

    var searchbox = L.DomUtil.create('input', 'leaflet-search-text', search);
    searchbox.setAttribute('type', 'text');
    searchbox.setAttribute('placeholder', this.options.placeholder);
    this.searchbox = searchbox;

    var appendButton = L.DomUtil.create('div', 'leaflet-search-group-button', search);

    if(this.options.icon === undefined){
    var searchButton = L.DomUtil.create(
      'button',
      'leaflet-search-group-text',
      appendButton
    );
    searchButton.innerText = 'Cerca';
    this.searchButton = searchButton;
    }
    else{
    var searchButton = L.DomUtil.create(
      'i',
      this.options.icon,
      appendButton
    );
    searchButton.setAttribute('aria-hidden', 'true');
    searchButton.style.fontSize = "20px";
    
    this.searchButton = searchButton;
    };

    // Create div for results window
    var resultsWindow = L.DomUtil.create('div', 'leaflet-search-text', search);
    resultsWindow.style.display = 'none';

    L.DomEvent.on(searchbox, 'click', this._blurSearch, this);

    L.DomEvent.on(searchButton, 'click', this._executeSearch, this);

    L.DomEvent.on(searchbox, 'keyup', this._ifExecuteSearch, this);

    this.resultsWindow = resultsWindow;

    return search;
  },

  onRemove: function(map) {
    L.DomEvent.off(searchbox, 'click', this._blurSearch, this);
    L.DomEvent.off(searchButton, 'click', this._executeSearch, this);
    L.DomEvent.off(map, 'keyup', this._ifExecuteSearch, this);
    if (typeof this.answers !== 'undefined' && this.answers.length > 0) {
      var that = this;
      this.results.forEach(function(item, index, array) {
        L.DomEvent.off(item.htmlElement, 'click', that.onClickResult, that);
      });
    }
  },

  //////////////////////////////////////////////////////

  _ifExecuteSearch: function(event){
    if (event.keyCode === 13){
      this._executeSearch(event);
      };
    },

  _blurSearch: function(e) {
    L.DomEvent.stopPropagation(e);
    L.DomEvent.preventDefault(e);
    this.resultsWindow.style.display = 'none';
    if(this.searchExtent){
    this._map.removeLayer(this.searchExtent);
    };

    if (typeof this.answers !== 'undefined' && this.answers.length > 0) {
      var that = this;
      this.results.forEach(function(item, index, array) {
        L.DomEvent.off(item.htmlElement, 'click', that.onClickResult, that);
        L.DomUtil.remove(item.htmlElement);
      });
    } else {
      L.DomUtil.remove(this.noResult);
    }
  },

  _executeSearch: function(e) {
    L.DomEvent.stopPropagation(e);
    L.DomEvent.preventDefault(e);
    this.resultsWindow.style.display = 'block';
    var that = this;

    // Chiamata per avere risultati ricerca:
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        var answers = this.responseText;
        const obj = JSON.parse(answers);
        if (typeof obj !== 'undefined' && obj.length > 0) {
          var results = obj.map(function(item) {
            console.log(obj);
            var htmlEl = L.DomUtil.create(
              'button',
              'leaflet-resultWindow',
              that.resultsWindow
            );
            htmlEl.innerHTML = that.options.infoField(item);
            L.DomEvent.on(htmlEl, 'click', that.onClickResult, that);

            return {
              htmlElement: htmlEl,
              content: item,
            };
          });
          }
         else {
          var noResult = L.DomUtil.create(
            'div',
            'leaflet-noResultWindow',
            that.resultsWindow
          );
          noResult.innerText = that.options.emptyResult; //in options
        }
        that.results = results;
        that.noResult = noResult;
        that.answers = obj;
      }
      else if(this.readyState === 4){
        alert('Si sono verificati errori durante la chiamata al servizio.')
      }
    };

    xhttp.open(
      'GET',
      this.buildRequest(),
      true
    );

    xhttp.send();
  },

  buildRequest: function() {
    
    var nameLocal = this.searchbox.value;
    var requestLink = 'https://nominatim.openstreetmap.org/search?q=' + nameLocal;

    var viewbox;
    var bounded;

    var eastMax = this._map.getBounds()._northEast.lng;
    var northMax = this._map.getBounds()._northEast.lat;
    var eastMin = this._map.getBounds()._southWest.lng;
    var northMin = this._map.getBounds()._southWest.lat;

    if(this.options.viewbox){
      viewbox = [eastMin, northMin, eastMax, northMax];
      requestLink = requestLink.concat("&viewbox=", viewbox);
    };

    if(this.options.bounded){
      bounded = 1;
      requestLink = requestLink.concat("&bounded=", bounded);
    };

    if(this.options.countrycodes){
      requestLink = requestLink.concat(
      "&countrycodes=", this.options.countrycode);
    };

    requestLink = requestLink.concat(
      '&limit=', this.options.maxResult,
      '&format=json&addressdetails=1');

    console.log(requestLink);

    return requestLink;
  },

  onClickResult: function(e) {
    L.DomEvent.stopPropagation(e);
    L.DomEvent.preventDefault(e);
    var cliccato = this.results.find(function(item, index, array) {
      return item.htmlElement === e.target;
    });

    this._map.fire("search:locate", cliccato.content);

    this._blurSearch(e);

  },
});