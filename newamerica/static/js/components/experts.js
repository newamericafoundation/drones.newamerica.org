$(function(){

	var ListView = {
        model:{},
        view:{},
        collection:{},
        router:{}
      };

	var Expert = Backbone.Model.extend({
	    defaults: {
	    	name: "Expert name",
			lastName: "LastName",
			jobTitle: "Empty Job Title",
			url: "empty-path",
	        photo: "http://placehold.it/80x80"
	    },

	    selector: null
	});

	var ExpertList = Backbone.Collection.extend({
	    model: Expert
	});


	var ExpertView = Backbone.View.extend({
	    tagName: "article",
	    className: "expert-container",
	    template: _.template($("#expertTemplate").html()),
	 
	    render: function () {
	        this.$el.html(this.template(this.model.toJSON()));
	        return this;
	    }
	});

	// the filtered list
	var ListView = Backbone.View.extend({
	    el: $("#experts"),
	 
	    initialize: function () {
	        this.collection = new ExpertList(people);
	        this.render();
	        
	        // add a select dropdown
	        this.$el.find("#filter").append(this.createSelect());
	        
	        // check for event trigger
	        this.on("change:filterTitle", this.filterByTitle, this);
	        // reset
            this.collection.on("reset", this.render, this);
            console.log('initialize: ');
            console.log(this);
	    },
	 
	    render: function () {
	        this.$el.find("article").remove();

	        // pull necessary models
	        _.each(this.collection.models, function (item) {
	            this.renderExpert(item);
	        }, this);

	    },
	 
	    renderExpert: function (item) {
	        var expertView = new ExpertView({
	            model: item
	        });
	        this.$el.append(expertView.render().el);
	        
	    },

	    // filter
	    getTitles: function () {
		    return _.uniq(this.collection.pluck("jobtitle"));
		},
		
		// getting rid of thissss
		createSelect: function () {
		    var select = $("<select/>", {
                    html: "<option value='all'>All</option>"
                });
		 
		    _.each(this.getTitles(), function (item) {
		        var option = $("<option/>", {
		            value: item,
		            text: item
		        }).appendTo(select);
		    });
		    return select;
		},

		// add events
        events: {
            "change #filter select": "setFilter"
        },

        //Set filter & fire trigger 
        setFilter: function (e) {
            this.filterTitle = e.currentTarget.value;
            this.trigger("change:filterTitle");
        },

        //filter the view
        filterByTitle: function () {
            if (this.filterTitle === "all") {
                this.collection.reset(people);
                expertsRouter.navigate("filter/all");
            } else {
                this.collection.reset(people, { silent: true });

                var filterTitle = this.filterTitle,
                    
                filtered = _.filter(this.collection.models, function (item) {
                    return item.get("jobtitle") === filterTitle;
                });

                this.collection.reset(filtered);

                expertsRouter.navigate("filter/" + filterTitle);
            }
        }
	});

	//add routing
    var ExpertsRouter = Backbone.Router.extend({
        routes: {
            "filter/:title": "urlFilter"
        },
        urlFilter: function (title) {
            list.filterTitle = title;
            list.trigger("change:filterTitle");
        }
    });

    var list = new ListView;

    var expertsRouter = new ExpertsRouter();

	//start history service
    Backbone.history.start();
	
});