L.Control.Toast = L.Control.extend({
  options : {
    position: "bottomright",  // Position of the widget on the map.
    summary: true,            // Summary text of the message.
    detail: true,             // Detail text of the message.
    life: 4000,               // Number of time in milliseconds to wait before closing the message.
    sticky: true,            // If true, the message is kept visible. If false, the message should be automatically closed based on life property.
    closable: true,           // When enabled, displays a close icon to hide a message manually.
    successIcon: "fal fa-check-circle",
    warnIcon: "fal fa-exclamation-triangle",
    errorIcon: "fal fa-times",
    infoIcon: "fal fa-info-circle",
  },
 
  initialize: function(options) {
        L.setOptions(this, options);
    },
 
  onHide: function(){
    this.elemento.style.display='none';
  },

  onClose: function(e){
    L.DomEvent.stopPropagation(e);
    L.DomEvent.preventDefault(e);
    this.onHide();
  },

  onShow: function(){
    this.elemento.style.display='block';
  },

  onShowTime:function() {
    if(this.idTimeout) {
      clearTimeout(this.idTimeout);
    }

    this.onShow();
    if (!this.options.sticky) {
      var that = this;
      this.idTimeout = setTimeout(function(){
          that.onHide();
        }, this.options.life);
    };
  },

  setMessage: function(message) {
    if (this.options.summary) {
    this.toastSummary.innerText = message.title;
    };
    if (this.options.detail) {
    this.toastDetail.innerText = message.text;
    }
  },

  _removeAllClass : function() {
    L.DomUtil.removeClass(this.elemento, 'leaflet-toast-message-info');

    L.DomUtil.removeClass(this.elemento, 'leaflet-toast-message-success');
    
    L.DomUtil.removeClass(this.elemento, 'leaflet-toast-message-warn');
    
    L.DomUtil.removeClass(this.elemento, 'leaflet-toast-message-error');
    
    var that = this;

    var splitSuccessIcon = this.options.successIcon.split(" ");
    splitSuccessIcon.forEach( function(icon){
      L.DomUtil.removeClass(that.toastIcon, icon)
      }
    );
    
    var splitWarnIcon = this.options.warnIcon.split(" ");
    splitWarnIcon.forEach( function(icon){
      L.DomUtil.removeClass(that.toastIcon, icon)
      }
    );

    var splitErrorIcon = this.options.errorIcon.split(" ");
    splitErrorIcon.forEach( function(icon){
      L.DomUtil.removeClass(that.toastIcon, icon)
      }
    );

    var splitInfoIcon = this.options.infoIcon.split(" ");
    splitInfoIcon.forEach( function(icon){
      L.DomUtil.removeClass(that.toastIcon, icon)
      }
    );
  },

  success : function(successo) {
    this.setMessage(successo);
    this._removeAllClass();
    L.DomUtil.addClass(this.elemento, 'leaflet-toast-message-success');
    L.DomUtil.addClass(this.toastIcon, this.options.successIcon);
    this.onShowTime();
  },

  info : function(informazione) {
    this.setMessage(informazione);
    this._removeAllClass();
    L.DomUtil.addClass(this.elemento, 'leaflet-toast-message-info');
    L.DomUtil.addClass(this.toastIcon, this.options.infoIcon);
    this.onShowTime();
  },
 
  warn : function(attenzione) {
    this.setMessage(attenzione);
    this._removeAllClass();
        L.DomUtil.addClass(this.elemento, 'leaflet-toast-message-warn');
    L.DomUtil.addClass(this.toastIcon, this.options.warnIcon);
    this.onShowTime();
  },

  error : function(errore) {
    this.setMessage(errore);
    this._removeAllClass();
            L.DomUtil.addClass(this.elemento, 'leaflet-toast-message-error');
    L.DomUtil.addClass(this.toastIcon, this.options.errorIcon);
    this.onShowTime();
  },

  onAdd: function(map) {
    var elemento = L.DomUtil.create(
      'div',
      'leaflet-toast-message'
    );
    elemento.setAttribute('style', 'transform: translateY(0px); opacity: 1;');
    elemento.style.display='none';

    var toastContent = L.DomUtil.create(
      'div',
      'leaflet-toast-message-content',
      elemento
    );
    toastContent.setAttribute('aria-atomic', 'true');
    toastContent.setAttribute('aria-live', 'assertive');
    toastContent.setAttribute('role', 'alert');

    var toastIcon = L.DomUtil.create('i', this.options.infoIcon, toastContent);
		toastIcon.style.fontSize = '20px';
		toastIcon.style.verticalAlign = 'middle';

    var toastText = L.DomUtil.create(
      'div',
      'message-text',
      toastContent
    );
    toastText.setAttribute('style', '');

    var toastSummary = L.DomUtil.create(
      'div', 
      'message-summary', 
      toastText
    );

    var toastDetail = L.DomUtil.create(
      'div', 
      'message-detail', 
      toastText
    );

    var toastIconCloseLink = L.DomUtil.create(
      'button',
      'remove-button',
      toastContent
    );
    toastIconCloseLink.setAttribute('pripple', '');
    toastIconCloseLink.setAttribute('type', 'button');
    toastIconCloseLink.setAttribute('style', '');
    if (this.options.closable) {
      toastIconCloseLink.innerText = 'X';
      L.DomEvent.on(toastIconCloseLink, 'click', this.onClose, this);
    }
  
    var toastIconCloseIcon = L.DomUtil.create(
      'span',
      'p-toast-icon-close-icon pi pi-times',
      toastIconCloseLink
    );

    var toastInk = L.DomUtil.create(
      'span',
      'p-ink',
      toastIconCloseLink
    );

    this.toastSummary = toastSummary;
    this.toastDetail = toastDetail;
    this.elemento = elemento;
    this.toastIconCloseLink = toastIconCloseLink;
    this.toastIcon = toastIcon;

    return elemento;
  },

  onRemove: function(map) {
    if(this.idTimeout) {
      clearTimeout(this.idTimeout);
    };
    if(this.toastIconCloseLink) {
    L.DomEvent.off(this.toastIconCloseLink, 'click', this.onClose, this);
    }
  },
});


