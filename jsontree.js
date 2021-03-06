!function ($) {
  "use strict"; // jshint ;_;

  var _render = function(obj, p, options){
    var parent = $(p);
    var ic = 0;
    var count = 0 ;
    for (var key in obj) {
      if (!obj.hasOwnProperty(key)){
        continue;
      }
      count+=1;
    }

    for (var key in obj) {
      if (!obj.hasOwnProperty(key)){
        continue;
      }
      ic +=1;

      var coma = '';
      if (ic < count){
        coma = ',';
      }
      if (obj[key] === null){
        parent.append('<li><span class="key">'+key+':</span><span path="' + key + '" class="value null"> null </span>'+coma+'</li>');
      } else if (typeof obj[key] === 'boolean'){
        parent.append('<li><span class="key">'+key+':</span><span path="' + key + '" class="value boolean">'+obj[key]+'</span>'+coma+'</li>');
      } else if (typeof obj[key] === 'number'){
        parent.append('<li><span class="key">'+key+':</span><span path="' + key + '" class="value number">'+obj[key]+'</span>'+coma+'</li>');
      } else if (typeof obj[key] === 'string'){
        parent.append('<li><span class="key">'+key+':</span><span path="' + key + '" class="value string">"'+obj[key]+'"</span>'+coma+'</li>');
      } else if ($.isArray(obj[key])) {
        if (key != 0 && options.fold_nodes) {
          var arval = $('<li><span class="key">'+key+':</span><span class="fold folded">[</span><ul path="' + key + '" class="value array" style="display: none;"></ul><span>]</span>'+coma+'</li>');
        } else {
          var arval = $('<li><span class="key">'+key+':</span><span class="fold">[</span><ul path="' + key + '" class="value array"></ul><span>]</span>'+coma+'</li>');
        }
        parent.append(arval);
        arval.find('.unfold').data('card', _render(obj[key], arval.find('.array'), options)) ;
      }else{
        if (key != 0 && options.fold_nodes) {
          var oval = $('<li><span class="key">'+key+':</span><span class="fold folded">{</span><ul path="' + key + '" class="value object" style="display: none;"></ul><span>}</span>'+coma+'</li>');
        } else {
          var oval = $('<li><span class="key">'+key+':</span><span class="fold">{</span><ul path="' + key + '" class="value object"></ul><span>}</span>'+coma+'</li>');
        }
        parent.append(oval);
        oval.find('.unfold').data('card', _render(obj[key], oval.find('.object'), options));
      }
    }
    return ic;
  };

  $(document).on("click", '.jsontree .fold', function(e){
    e.preventDefault();
    $(this).addClass('folded').parent().find('ul').slideUp();
  });

  $(document).on('click', '.jsontree .fold.folded', function(e){
    e.preventDefault();
    $(this).removeClass('folded').parent().find('ul').slideDown();
  });

  var JsonTree = function(self, options){
    var j = $.parseJSON(self.data('jsontree'));
    self.append('<ul class="jsontree"></ul>');
    _render([j], self.find('.jsontree'), options);
  };

  $.fn.jsontree = function (json, options) {
    return this.each(function () {
      var self = $(this), data = self.data('jsontree');
      if (!data) {
        if (typeof json == 'string') {
          data = json;
          self.data('jsontree', json);
        }else{
          data = {};
          self.data('jsontree', '');
        }
      }
      var default_options = {
        fold_nodes: false
      };
      options = $.extend(default_options, options || {});
      new JsonTree(self, options);
    });
  };

}(window.jQuery);
