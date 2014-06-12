(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['activation'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<form class=\"form-signin\" role=\"form\">\n  <h1 class=\"form-signin-heading\">Screen activation</h1>\n  <input type=\"text\" class=\"form-control form-activation-code\" placeholder=\"Activation code\" required autofocus>\n  <button class=\"btn btn-primary btn-block btn-activate\" type=\"submit\">";
  if (helper = helpers.button) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.button); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</button>\n</form>";
  return buffer;
  });
templates['slide'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += "\n    <img class=\"image\" src=\""
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\" />\n  ";
  return buffer;
  }

  buffer += "<div class=\"slide\">\n  ";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 && depth0.media)),stack1 == null || stack1 === false ? stack1 : stack1.image), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>";
  return buffer;
  });
})();