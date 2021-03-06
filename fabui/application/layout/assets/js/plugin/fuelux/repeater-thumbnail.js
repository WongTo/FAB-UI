/*
 * Fuel UX Repeater - Thumbnail View Plugin
 * https://github.com/ExactTarget/fuelux
 *
 * Copyright (c) 2014 ExactTarget
 * Licensed under the BSD New license.
 */

// -- BEGIN UMD WRAPPER PREFACE --

// For more information on UMD visit: 
// https://github.com/umdjs/umd/blob/master/jqueryPlugin.js

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // if AMD loader is available, register as an anonymous module.
         define(['jquery', 'fuelux/repeater'], factory);
    } else {
        // OR use browser globals if AMD is not present
        factory(jQuery);
    }
}(function ($) {
// -- END UMD WRAPPER PREFACE --

// -- BEGIN MODULE CODE HERE --

	if($.fn.repeater){

		//ADDITIONAL METHODS
		$.fn.repeater.Constructor.prototype.thumbnail_clearSelectedItems = function(){
			this.$canvas.find('.repeater-thumbnail-cont .repeater-thumbnail.selected').removeClass('selected');
		};

		$.fn.repeater.Constructor.prototype.thumbnail_getSelectedItems = function(){
			var selected = [];
			this.$canvas.find('.repeater-thumbnail-cont .repeater-thumbnail.selected').each(function(){
				selected.push($(this));
			});
			return selected;
		};

		$.fn.repeater.Constructor.prototype.thumbnail_setSelectedItems = function(items, force){
			var selectable = this.options.thumbnail_selectable;
			var self = this;
			var i, $item, l;

			var eachFunc = function(){
				$item = $(this);
				if($item.is(items[i].selector)){
					selectItem($item, items[i].selected);
				}
			};

			var selectItem = function($itm, select){
				select = (select!==undefined) ? select : true;
				if(select){
					if(!force && selectable!=='multi'){
						self.thumbnail_clearSelectedItems();
					}
					$itm.addClass('selected');
				}else{
					$itm.removeClass('selected');
				}
			};

			if(!$.isArray(items)){
				items = [items];
			}
			if(force===true || selectable==='multi'){
				l = items.length;
			}else if(selectable){
				l = (items.length>0) ? 1 : 0;
			}else{
				l = 0;
			}
			for(i=0; i<l; i++){
				if(items[i].index!==undefined){
					$item = this.$canvas.find('.repeater-thumbnail-cont .repeater-thumbnail:nth-child(' + (items[i].index + 1) + ')');
					if($item.length>0){
						selectItem($item, items[i].selected);
					}
				}else if(items[i].selector){
					this.$canvas.find('.repeater-thumbnail-cont .repeater-thumbnail').each(eachFunc);
				}
			}
		};

		//ADDITIONAL DEFAULT OPTIONS
		$.fn.repeater.defaults = $.extend({}, $.fn.repeater.defaults, {
			thumbnail_infiniteScroll: false,
			thumbnail_itemRendered: null,
			thumbnail_selectable: false,
			thumbnail_template: '<div class="thumbnail repeater-thumbnail"><img height="75" src="{{src}}" width="65"><span>{{name}}</span></div>'
		});

		//EXTENSION DEFINITION
		$.fn.repeater.views.thumbnail = {
			selected: function(helpers, callback){
				var infScroll = this.options.thumbnail_infiniteScroll;
				var opts;
				if(infScroll){
					opts = (typeof infScroll === 'object') ? infScroll : {};
					this.infiniteScrolling(true, opts);
				}
				callback({});
			},
			renderer: {
				render: function(helpers, callback){
					var $item = this.$canvas.find('.repeater-thumbnail-cont');
					var obj = {};
					var $empty;
					if($item.length>0){
						obj.action = 'none';
					}else{
						$item = $('<div class="clearfix repeater-thumbnail-cont" data-container="true" data-infinite="true" data-preserve="shallow"></div>');
					}
					obj.item = $item;
					if(helpers.data.items.length<1){
						obj.skipNested = true;
						$empty = $('<div class="empty"></div>');
						$empty.append(this.options.thumbnail_noItemsHTML);
						$item.append($empty);
					}else{
						$item.find('.empty:first').remove();
					}
					callback(obj);
				},
				nested: [
					{
						after: function(helpers, callback){
							var obj = {
								container: helpers.container,
								itemData: helpers.subset[helpers.index]
							};
							var selectable = this.options.thumbnail_selectable;
							var selected = 'selected';
							var self = this;
							var $item;
							if(helpers.item!==undefined){
								obj.item = helpers.item;
								if(selectable){
									$item = $(obj.item);
									$item.addClass('selectable');
									$item.on('click', function(){
										if(!$item.hasClass(selected)){
											if(selectable!=='multi'){
												self.$canvas.find('.repeater-thumbnail-cont .repeater-thumbnail.selected').each(function(){
													var $itm = $(this);
													$itm.removeClass(selected);
													self.$element.trigger('deselected.fu.repeaterThumbnail', $itm);
												});
											}
											$item.addClass(selected);
											self.$element.trigger('selected.fu.repeaterThumbnail', $item);
										}else{
											$item.removeClass(selected);
											self.$element.trigger('deselected.fu.repeaterThumbnail', $item);
										}
									});
								}
							}
							if(this.options.thumbnail_itemRendered){
								this.options.thumbnail_itemRendered(obj, function(){
									callback();
								});
							}else{
								callback();
							}
						},
						render: function(helpers, callback){
							var item = helpers.subset[helpers.index];
							var template = function(str){
								var invalid = false;
								var replace = function(){
									var end, start, val;

									start = str.indexOf('{{');
									end = str.indexOf('}}', start+2);

									if(start>-1 && end>-1){
										val = $.trim(str.substring(start+2, end));
										val = (item[val]!==undefined) ? item[val] : '';
										str = str.substring(0, start) + val + str.substring(end+2);
									}else{
										invalid = true;
									}
								};

								while(!invalid && str.search('{{')>=0){
									replace(str);
								}
								return str;
							};
							callback({ item: template(this.options.thumbnail_template) });
						},
						repeat: 'data.items'
					}
				]
			}
		};

	}

// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --