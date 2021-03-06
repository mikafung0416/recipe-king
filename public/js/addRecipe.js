/* Imgur Upload Script */
(function (root, factory) {
  "use strict";
  if (typeof define === 'function' && define.amd) {
      define([], factory);
  } else if (typeof exports === 'object') {
      module.exports = factory();
  } else {
      root.Imgur = factory();
  }
}(this, function () {
  "use strict";
  var Imgur = function (options) {
      if (!this || !(this instanceof Imgur)) {
          return new Imgur(options);
      }

      if (!options) {
          options = {};
      }

      if (!options.clientid) {
          throw 'Provide a valid Client Id here: https://api.imgur.com/';
      }

      this.clientid = options.clientid;
      this.endpoint = 'https://api.imgur.com/3/image';
      this.callback = options.callback || undefined;
      this.dropzone = document.querySelectorAll('.dropzone');
      this.info = document.querySelectorAll('.info');

      this.run();
  };

  Imgur.prototype = {
      createEls: function (name, props, text) {
          var el = document.createElement(name), p;
          for (p in props) {
              if (props.hasOwnProperty(p)) {
                  el[p] = props[p];
              }
          }
          if (text) {
              el.appendChild(document.createTextNode(text));
          }
          return el;
      },
      insertAfter: function (referenceNode, newNode) {
          referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
      },
      post: function (path, data, callback) {
          var xhttp = new XMLHttpRequest();

          xhttp.open('POST', path, true);
          xhttp.setRequestHeader('Authorization', 'Client-ID ' + this.clientid);
          xhttp.onreadystatechange = function () {
              if (this.readyState === 4) {
                  if (this.status >= 200 && this.status < 300) {
                      var response = '';
                      try {
                          response = JSON.parse(this.responseText);
                      } catch (err) {
                          response = this.responseText;
                      }
                      callback.call(window, response);
                  } else {
                      throw new Error(this.status + " - " + this.statusText);
                  }
              }
          };
          xhttp.send(data);
          xhttp = null;
      },
      createDragZone: function () {
          var p1, p2, input;

              p1 = this.createEls('p', {}, 'Choose your photo and wait for the preview!');
              // p2 = this.createEls('p', {}, 'Or click here to select image');
          input = this.createEls('input', {type: 'file', className: 'input', accept: 'image/*', required: true});

          Array.prototype.forEach.call(this.info, function (zone) {
              zone.appendChild(p1);
              // zone.appendChild(p2);
          }.bind(this));
          Array.prototype.forEach.call(this.dropzone, function (zone) {
              zone.appendChild(input);
              this.status(zone);
              this.upload(zone);
          }.bind(this));
      },
      loading: function () {
          var div, table, img;

          div = this.createEls('div', {className: 'loading-modal'});
          table = this.createEls('table', {className: 'loading-table'});
          // img = this.createEls('img', {className: 'loading-image', src: './public/assets/image/loading-spin.svg'});

          div.appendChild(table);
          // table.appendChild(img);
          document.body.appendChild(div);
      },
      status: function (el) {
          var div = this.createEls('div', {className: 'status'});

          this.insertAfter(el, div);
      },
      matchFiles: function (file, zone) {
          var status = zone.nextSibling;

          if (file.type.match(/image/) && file.type !== 'image/svg+xml') {
              document.body.classList.add('loading');
              status.classList.remove('bg-su', 'bg-danger');
              status.innerHTML = '';

              var fd = new FormData();
              fd.append('image', file);

              this.post(this.endpoint, fd, function (data) {
                  document.body.classList.remove('loading');
                  typeof this.callback === 'function' && this.callback.call(this, data);
              }.bind(this));
          } else {
              status.classList.remove('bg-su');
              status.classList.add('bg-danger');
              status.innerHTML = 'Invalid archive';
          }
      },
      upload: function (zone) {
          var events = ['dragenter', 'dragleave', 'dragover', 'drop'],
              file, target, i, len;

          zone.addEventListener('change', function (e) {
              if (e.target && e.target.nodeName === 'INPUT' && e.target.type === 'file') {
                  target = e.target.files;

                  for (i = 0, len = target.length; i < len; i += 1) {
                      file = target[i];
                      this.matchFiles(file, zone);
                  }
              }
          }.bind(this), false);

          events.map(function (event) {
              zone.addEventListener(event, function (e) {
                  if (e.target && e.target.nodeName === 'INPUT' && e.target.type === 'file') {
                      if (event === 'dragleave' || event === 'drop') {
                          e.target.parentNode.classList.remove('dropzone-dragging');
                      } else {
                          e.target.parentNode.classList.add('dropzone-dragging');
                      }
                  }
              }, false);
          });
      },
      run: function () {
          var loadingModal = document.querySelector('.loading-modal');

          if (!loadingModal) {
              this.loading();
          }
          this.createDragZone();
      }
  };

  return Imgur;
}));

// photo upload using Imgur
let feedback = function(res) {
  if (res.success === true) {
      var get_link = res.data.link.replace(/^http:\/\//i, 'https://');
      document.querySelector('.status').classList.add('bg-su');
      document.querySelector('.status').innerHTML =
          '<br><input class="image-url" name="photo" value=\"' + get_link + '\"/ style="display: none">' + '<img id="user-photo" class="img" alt="Imgur-Upload" src=\"' + get_link + '\"/>' + '<br>';
  }
};

new Imgur({
  clientid: '335ca0f227387e1', //You can change this ClientID
  callback: feedback
});

// more button for ingredients
let i = 1;
$('#more-ingredient').click(() => {
  $(`#ingredient-box-${i}`).append(`<span id="ingredient-box-${i+1}"><input type="text" name="ingredient" class="add-text" id="ingredient-${i+1}" placeholder="e.g. salt"></span>`);
  i++;
})

// more button for equipment
let j = 1;
$('#more-equipment').click(() => {
  $(`#equipment-box-${j}`).append(`<span id="equipment-box-${j+1}"><input type="text" name="equipment" class="add-text" id="equipment-${j+1}" placeholder="e.g. spatula"></span>`);
  j++;
})

// more button for instructions
let k = 1;
$('#more-instruction').click(() => {
  $(`#instruction-box-${k}`).append(`<span id="instruction-box-${k+1}"><input type="text" name="instruction" class="add-text" id="instruction-${k+1}" placeholder="e.g. Add rigatoni and boil until al dente."></span>`);
  k++;
})

