App.Models.Contact = Backbone.Model.extend({

   defaults: {
      name: '',
      url: '',
      initial: '',
      jobtitle: 'Full Job Title',
      type: '',
      program: '',
      thumb: 'http://placehold.it/80x80',
      photo: 'http://placehold.it/80x80',
      expertise: ''
   },

   selector: null,

   match: function ( select ) {

      //this.selector = select;

      return (
               select.search_text.length == 0 ||
               ( select.search_text.length > 0 &&
                 _.chain(
                   _.values(
                     _.pick(this.attributes, 'name', 'jobtitle', 'type', 'initial')
                    )
                  )
                  .any(
                     function( s ) {
                           return s.toLowerCase().indexOf(select.search_text.toLowerCase()) > -1;
                        }
                     )
                  .value()
               )
              );
   }


});

App.Collections.Contacts = Backbone.Collection.extend({

   model: App.Models.Contact,
   comparator: 'name',
   jobtype: function ( jobtype ) {

      return this.where({type: jobtype});
   }


});

App.Views.ContactItem = Backbone.View.extend({

   template: null,

   tagName: 'div',
   className: 'expert',

   initialize: function ( options ) {
      this.template = _.template($('#contact-item').html());
   },

   render: function () {

      this.$el.html(this.template( this.formattedJSON() ));

      this._super();

      return this;
   },

   formattedJSON: function () {

      var item = this.model,
          select = item.selector,
          data = item.toJSON()//,
          // check = new RegExp( $.ui.autocomplete.escapeRegex(select.search_text), 'i' );

      return data;
   }

});


App.Views.ContactList = Backbone.ListView.extend({

   template: null,

   tagName: 'div',
   className: 'ui-list-rows',

   itemView: App.Views.ContactItem,

});


// var AbstractView = Backbone.View.extend({
var AbstractView = Backbone.ListView.extend({

   itemView: App.Views.ContactList,

   _initialize : function(){

      this.template = _.template('<h1>My title is: <%= title %></h1>');

   },
   initialize: function(){
      this.render();
   }

});

var BoardMemberView = AbstractView.extend({

   className : "board",
   title: "Board Members",

   template: _.template('<h1>My title is: <%= title %></h1>'),

   render: function(){
      console.log('this is', this);

      this.$el.html( this.template({title:"board members"}) );
      // return this.template({title: "board members"});
      return this
      // return this.$el.html(this.template(this));

   }

});
var FellowsView = AbstractView.extend({

   className : "fellow",

   initialize : function(){

      this._initialize();

   },
   render : function(){

      this.$el.html( this.template({title:"fellows"}) );

   }

});
// MASTER
// var MasterList = App.Views.ContactList.extend({
var MasterList = AbstractView.extend({
   // boardMembersView:  new BoardMemberView({collection: this.collection.jobtype('staff')}),
   initialize: function() {
      //this.boardMemberView = new BoardMemberView({collection: this.collection.jobtype('staff')});
      this.fellowsView = new FellowsView({collection: this.collection.jobtype('staff')});
   },

   render: function() {
      App.Views.ContactList.prototype.render.apply(this)
      //AbstractView.prototype.render.apply(this);
      // var boardMembers = new BoardMemberView({collection: this.collection.jobtype('staff')});
      console.log('Fellow is:', this.fellowsView);
         // boardMembers.render();
         this.fellowsView.render();

      this.$el.append( this.fellowsView.el );

      // var fellowView = new FellowsView();
      //    fellowView.render();

      // this.$el.append( fellowView.el );

      return this;
   }
});


App.Views.ContactFilter = Backbone.FormView.extend({

   template: null,

   tagName: 'div',

   initialize: function ( options ) {
      this.template = _.template($('#contact-filter').html());
   },

   render: function () {

      this.$el.html(this.template());

      this._super();

      return this;
   }

});

App.Views.ContactLayout = Backbone.View.extend([
      App.Views.FillHeight
   ],{

   template: null,

   tagName: 'div',
   className: 'ui-list-wrapper ds-contact-list',

   initialize: function ( options ) {

      this.template = _.template($('#contact-list').html());


   },

   render: function () {

      this.$el.html(this.template());

      this._super();

      return this;
   }

});

App.Controller = Controller.extend({

   filter: null,
   source: null,
   selected: null,

   container: null,

   layoutView: null,
   filterForm: null,
   resultList: null,

   initialize: function ( options ) {
      var options = options || {};

      this.container = options.container || 'body';
   },

   start: function () {

      this.source = new App.Collections.Contacts( people );
      this.selected = new App.Collections.Contacts();
      this.filter = new Backbone.Model({ search_text: '' });

      this.layoutView = new App.Views.ContactLayout();
      this.filterForm = new App.Views.ContactFilter({ model: this.filter });
      this.resultList = new MasterList({ collection: this.selected });

      $(this.container).append( this.layoutView.render().$el );
      this.layoutView.$('.ui-list-options').append( this.filterForm.render().$el );
      this.layoutView.$('.ui-list-content').append( this.resultList.render().$el );

      this.listenTo(this.filter, 'change', this.applyFilters);
      this.layoutView.refresh();
   },

   organize: function () {

      this.source.reset( this.source.filter(function ( model ) {
            model.get('type') == 'board';
         }));
   },

   applyFilters: function () {

      var selector = this.filter.toJSON();

      this.selected.reset( this.source.filter(function ( model ) {

            return model.match( selector );

         }));
   }

});
