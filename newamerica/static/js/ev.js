var now = moment({h: 0, m: 0, s: 0});

var paginate = 6;

var Event = Backbone.Model.extend({
  defaults: {
    title: "Event Title",
    author: "Author",
    enddate: "2010-01-01"
  }
});

var ListItemView = Marionette.ItemView.extend({
  template: '#event-item',
  tagName: 'li',

   templateHelpers: function () {
    return {
      ender: function(){
        if (this.programs.length == 0) {
          return '';
        }
        program_list = "<span>| "
        program_list += _.map(this.programs, function(prog) {
          return "<a class=\"icon dark dib " + prog + "\"><b class=\"progname\">" + prog + "</b></a>";
        }).join('\n');
        program_list += "</span>"
        return program_list;
      },
      multiday: function(){
        var date = this.date;
        var end = this.enddate;
        if (end == '' || end == null) {
          return date;
        } else {
          return date + " - " + end;
        }
      }
  };
  }
});

var ListView = Marionette.CollectionView.extend({
  itemView: ListItemView,

  appendHtml: function(collectionView, itemView, index){
    collectionView.$el.append(itemView.el);
  }
});

var ObscuraControls = Marionette.ItemView.extend({
  events: {
    'change .options input[type=checkbox]': 'changeType',
    'click .upcoming': 'filterFuture',
    'click .past': 'filterPast',
    'click .loadMore': 'loadMore'
  },

  collectionEvents: {
    'paginated:change:page': 'onRender',
    'paginated:change:numPages': 'onRender',
  },

  onRender: function() {
    var curPerPage = this.collection.getPerPage();
    var filtered = this.collection.getFilteredLength();

    if ( filtered < curPerPage  ) {
      this.$('.loadMore').addClass( "hidden" );
    } else{
      this.$('.loadMore').removeClass( "hidden" );
    }
    if (this.collection.hasFilter('org-filter')) {
      this.$('.results').removeClass( "hidden" ).text(filtered);
    }
    if (this.collection.hasFilter('published-filter')) {
      this.$('.results').removeClass( "hidden" ).text(filtered);
    }
  },

  changeType: function(ev) {
    var typeArray = [];
    var selected;
    var rst = false;
    var $checked = this.$('.options input:checked');

    $checked.each(function() {
      if ($(this).val() == 'reset') {
        $checked.each(function() {
          $(this).removeAttr('checked');
          typeArray = [];
          selected = [];
        });
        rst = true;
      }
      if (!rst) {
        typeArray.push($(this).val());
      }
    });

    selected = typeArray.join(',') + ",";
    
    if(selected.length > 1){
      this.collection.resetFilters();

        var ot = _.map(typeArray, function(i){
          return i.replace('_', ' ').toProperCase().replace(' ', '_');
        });

        this.collection.filterBy('org-filter', {type: function(v){
          return _.contains(ot, v); 
        }});

      this.$('.results').removeClass( "hidden" ).text(this.collection.getFilteredLength());
    }else{
      this.collection.resetFilters();
      this.$('.results').addClass( "hidden" );
    }  
  },

  filterFuture: function() {
    this.$('.null-state.past').addClass( "hidden" );
  	this.collection.resetFilters();
    this.collection.filterBy('future-filter', function(model) {
      var theDate = model.get('enddate') || model.get('date');
      theDate = moment(theDate, 'MMMM DD, YYYY');
      return now.isSame(theDate, 'day') || now.isBefore(theDate, 'day');
    })
    this.collection.setSort(function(model) {
      sortDate = model.get('date');
      return moment(sortDate)._d;
    }, 'asc');

    var filtered = this.collection.getFilteredLength();
    if (filtered == 0) {
      this.$('.null-state.upcoming').removeClass( "hidden" );
    } else{
      this.$('.null-state.upcoming').addClass( "hidden" );
    };
  },

  filterPast: function() {
    this.$('.null-state.upcoming').addClass( "hidden" );
  	this.collection.resetFilters();
    this.collection.filterBy('past-filter', function(model) {
      var theDate = model.get('enddate') || model.get('date');
      theDate = moment(theDate, 'MMMM DD, YYYY');
      return now.isAfter(theDate, 'day');
    })
    this.collection.setSort(function(model) {
      return moment(model.get('date'))._d;
    }, 'desc');
    var filtered = this.collection.getFilteredLength();
    if (filtered == 0) {
      this.$('.null-state.past').removeClass( "hidden" );
    } else{
      this.$('.null-state.past').addClass( "hidden" );
    };
  },

  loadMore: function() {
    var curPerPage = this.collection.getPerPage();
    this.collection.setPerPage(curPerPage*2);
  }
});

var App = new Backbone.Marionette.Application();

App.addRegions({
  obscuraList: '.obscura-list'
});

var initialData = _.map(events, function(ev){
  var e = new Event(ev);
  return e;
});

var superset = new Backbone.Collection(initialData);
var proxy = new Backbone.Obscura(superset);


App.addInitializer(function(options) {

  proxy.setPerPage(paginate);

  var obscuraList = new ListView({
    collection: proxy
  });

  var obscuraControls = new ObscuraControls({
    collection: proxy,
    el: '.obscura-controls'
  });

  App.obscuraList.show(obscuraList);
});

App.start();
