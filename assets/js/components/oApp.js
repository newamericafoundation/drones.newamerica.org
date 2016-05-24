
var Expert = Backbone.Model.extend({
  defaults: {
    name: "Expert name",
    jobtitle: "Empty Job Title",
    url: "empty-path",
    type: "staff",
    photo: "../images/experts/avatar-placeholder.png",
    thumb: "../images/experts/avatar-placeholder.png"
  }
});

var ListItemView = Marionette.ItemView.extend({
  template: '#expert-item',
  tagName: 'div',
  className: 'expert-container',

});

var ListView = Marionette.CollectionView.extend({
  className: 'list-row',
  tagName: 'div',
  itemView: ListItemView,

  appendHtml: function(collectionView, itemView, index){
    collectionView.$el.append(itemView.el);
  }
});

var index = 0;
// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
// -_-STAFF SECTION-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
var staffView = Marionette.ItemView.extend({
  className: 'expert-container',
  template: '#staff',

 templateHelpers: function () {
    return {
      pprogram: function(){
        if (this.program == '' && index == '0') {
          index++;
          return "<section class=\"staffers\">";
        } else if (this.program == 'asset-building' && index == '1') {
          index++;
          return "</section><section class=\"ab\"><header><h3>AssetBuilding</h3></header>";
        } else if (this.program == 'breadwinning-caregiving' && index == '2') {
          index++;
          return "2";
        } else if (this.program == 'economic-growth' && index == '2') {
          index++;
          return "</section>";
        } else if (this.program == 'education-policy' && index == '3') {
          index++;
          return "4";
        } else if (this.program == 'fellows' && index == '4') {
          index++;
          return "5";
        } else if (this.program == 'future-tense') {
          return "6";
        } else if (this.program == 'international-security') {
          return "7";
        } else if (this.program == 'live') {
          return "8";
        } else if (this.program == 'nyc') {
          return "9";
        } else if (this.program == 'open-markets') {
          return "10";
        } else if (this.program == 'oti') {
          return "11";
        } else if (this.program == 'political-reform') {
          return "12";
        } else if (this.program == 'postsecondary-national-policy-institute') {
          return "13";
        } else if (this.program == 'x-lab') {
          return "14";
        };
      },
      prog: this.model.get('program'),
      iid: this.model.cid.substring(1)
    };
  }
});

var StaffCollectionView = Marionette.CollectionView.extend({
  itemView: staffView,
  initialize: function(){
    this.collection.filterBy('staff-filter', {'type': 'staff'})
    //this.collection.setSort('program', 'asc')
  },

  appendHtml: function(collectionView, itemView, index){
      collectionView.$el.append(itemView.el);
  }
});


// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
// -_-BOARD SECTION-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
var boardView = Marionette.ItemView.extend({
  className: 'expert-container',
  template: '#board',
});

var BoardCollectionView = Marionette.CollectionView.extend({
  itemView: boardView,

  initialize: function(){
    this.collection.filterBy('board-filter', {'type': 'board'});
  },
  appendHtml: function(collectionView, itemView, index){

    collectionView.$el.append(itemView.el);
  },
});


// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
// -_-FELLOW SECTION-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_

var fellowView = Marionette.ItemView.extend({
  className: 'expert-container',
  template: '#fellow',
});

var FellowCollectionView = Marionette.CollectionView.extend({
  itemView: fellowView,

  initialize: function(){
    this.collection.filterBy('fellow-filter', {'type': 'fellow'})
  },

  appendHtml: function(collectionView, itemView, index){
    collectionView.$el.append(itemView.el);
  }
});

// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
// -_-COUNCIL SECTION-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_

var councilView = Marionette.ItemView.extend({
  className: 'expert-container',
  template: '#council',
});

var CouncilCollectionView = Marionette.CollectionView.extend({
  itemView: councilView,

  initialize: function(){
    this.collection.filterBy('council-filter', {'type': 'council'})
  },

  appendHtml: function(collectionView, itemView, index){
    collectionView.$el.append(itemView.el);
  }
});


// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
// -_-CONTROLS_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
var ObscuraControls = Marionette.ItemView.extend({

  events: {
    'keyup .fuzzysearch': 'filterOnType'
  },

  filterOnType: _.debounce(function(ev) {
    var regex = new RegExp(this.$('.fuzzysearch').val(), 'i');

    this.collection.filterBy('filter-on-type', function(model) {
      return  regex.test(model.get('name') + model.get('expertise'));
    });
    console.log(bp.getFilteredLength());
    if (bp.getFilteredLength() == '0') {  
      $('.board').addClass( "hidden" );
      console.log('hide me');
    } else {
      $('.board').removeClass( "hidden" );
    }
    if (sp.getFilteredLength() == '0' ) {
      $('.staff').addClass( "hidden" );
    } else {
      $('.staff').removeClass( "hidden" );
    }
    if (fp.getFilteredLength() == '0' ) {
      $('.fellow').addClass( "hidden" );
    } else {
      $('.fellow').removeClass( "hidden" );
    }
    if ( this.$('.fuzzysearch').val() == '') {
      this.$('.results').addClass( "hidden" );
    } else {
      this.$('.results').removeClass( "hidden" ).text(this.collection.getFilteredLength());
    }
  }, 100),
});


// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
// -_-APP-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
var App = new Backbone.Marionette.Application();

App.addRegions({
  staffRegion: '#staffList',
  boardRegion: '#boardList',
  fellowRegion: '#fellowList',
  councilRegion: '#councilList'
});

var initialData = _.map(people, function(person){
  var e = new Expert(person);
  return e;
});

var superset = new Backbone.Collection(initialData);
var proxy = new Backbone.Obscura(superset);

var sp = new Backbone.Obscura(proxy);
var bp = new Backbone.Obscura(proxy);
var fp = new Backbone.Obscura(proxy);
var cp = new Backbone.Obscura(proxy);

App.addInitializer(function(options) {

  var staffRegion = new StaffCollectionView({
    collection: sp
  });

  var boardRegion = new BoardCollectionView({
    collection: bp
  });

  var fellowRegion = new FellowCollectionView({
    collection: fp
  });

  var councilRegion = new CouncilCollectionView({
    collection: cp
  });

  var obscuraControls = new ObscuraControls({
    collection: proxy,
    el: '.obscura-controls'
  });

  App.staffRegion.show(staffRegion);
  App.boardRegion.show(boardRegion);
  App.fellowRegion.show(fellowRegion);
  App.councilRegion.show(councilRegion);
});

App.start();



