define(["bimsurfer/src/EventHandler.js", "bimsurfer/src/Request.js", "bimsurfer/src/Utils.js"], function(EventHandler, Request, Utils) {
    
    function Row(args) {
        var self = this;
        
        this.setName = function(name) {
            args.name.appendChild(document.createTextNode(name));
        }
        
        this.setValue = function(value) {
            args.value.appendChild(document.createTextNode(value));
        }
    }
    
    function Section(args) {
        var self = this;
        
        var div = self.div = document.createElement("div");
        var nameh = document.createElement("h3");
        var table = document.createElement("table");
        
        var tr = document.createElement("tr");
        table.appendChild(tr);
        var nameth = document.createElement("th");
        var valueth = document.createElement("th");
        nameth.appendChild(document.createTextNode("Name"));
        valueth.appendChild(document.createTextNode("Value"));
        tr.appendChild(nameth);
        tr.appendChild(valueth);
        
        div.appendChild(nameh);
        div.appendChild(table);
        
        args.domNode.appendChild(div);
        
        this.setName = function(name) {
            nameh.appendChild(document.createTextNode(name));
        }
        
        this.addRow = function() {
            var tr = document.createElement("tr");
            table.appendChild(tr);
            var nametd = document.createElement("td");
            var valuetd = document.createElement("td");
            tr.appendChild(nametd);
            tr.appendChild(valuetd);
            return new Row({name:nametd, value:valuetd});
        }
    };
    
    function loadModelFromSource(src) {
        return new Promise(function (resolve, reject) {
            Request.Make({url: src}).then(function(xml) {
                var json = Utils.XmlToJson(xml, {'Name': 'name', 'id': 'guid'});
                
                var psets = Utils.FindNodeOfType(json, "properties")[0];
                var project = Utils.FindNodeOfType(json, "decomposition")[0].children[0];
                var types = Utils.FindNodeOfType(json, "types")[0];
                
                var objects = {};
                var typeObjects = {};
                var properties = {};
                psets.children.forEach(function(pset) {
                    properties[pset.guid] = pset;
                });
                
                var visitObject = function(parent, node) {
                    var props = [];
                    var o = (parent && parent.ObjectPlacement) ? objects : typeObjects;
                    
                    if (node["xlink:href"]) {
                        if (!o[parent.guid]) {
                            var p = Utils.Clone(parent);
                            p.GlobalId = p.guid;
                            o[p.guid] = p;
                            o[p.guid].properties = []
                        }
                        var g = node["xlink:href"].substr(1);
                        var p = properties[g];
                        if (p) {
                            o[parent.guid].properties.push(p);
                        } else if (typeObjects[g]) {
                            // If not a pset, it is a type, so concatenate type props
                            o[parent.guid].properties = o[parent.guid].properties.concat(typeObjects[g].properties);
                        }
                    }
                    node.children.forEach(function(n) {
                        visitObject(node, n);
                    });
                };
                
                visitObject(null, types);
                visitObject(null, project);
                
                resolve({model: {objects: objects, source: 'XML'}});
            });
        });
    }
    
    function MetaDataRenderer(args) {
        
        var self = this;        
        EventHandler.call(this);
        
        var models = {};
        var domNode = document.getElementById(args['domNode']);
        
        this.addModel = function(args) {
            return new Promise(function (resolve, reject) {
                if (args.model) {
                    models[args.id] = args.model;
                    resolve(args.model);
                } else {
                    loadModelFromSource(args.src).then(function(m) {
                        models[args.id] = m;
                        resolve(m);
                    });
                }
            });
        };
        
        var renderAttributes = function(elem) {
            var s = new Section({domNode:domNode});
            s.setName(elem.type || elem.getType());
            ["GlobalId", "Name", "OverallWidth", "OverallHeight", "Tag", "PredefinedType", "FlowDirection"].forEach(function(k) {
                var v = elem[k];
                if (typeof(v) === 'undefined') {
                    var fn = elem["get"+k];
                    if (fn) {
                        v = fn.apply(elem);
                    }
                }
                if (typeof(v) !== 'undefined') {
                    r = s.addRow();
                    r.setName(k);
                    r.setValue(v);
                }
            });
            return s;
        };
        
        var renderPSet = function(pset) {
            var s = new Section({domNode:domNode});
            if (pset.name && pset.children) {
                s.setName(pset.name);
                pset.children.forEach(function(v) {
                    var r = s.addRow();
                    r.setName(v.name);
                    r.setValue(v.NominalValue);
                });
            } else {
                pset.getName(function(name) {
                    s.setName(name);
                });
                pset.getHasProperties(function(prop) {
                    var r = s.addRow();
                    prop.getName(function(name) {
                        r.setName(name);
                    });
                    prop.getNominalValue(function(value) {
                        r.setValue(value._v);
                    });
                });
            }
            return s;
        };
        
        this.setSelected = function(oid) {
            if (self.highlightMode) {
            
                (self.selectedSections || []).forEach(function(s) {
                    s.div.className = "";
                });
                
                if (oid.length) {
                    self.sections[oid[0]].forEach(function(s) {
                        s.div.className = "selected";
                    });
                    
                    self.selectedSections = self.sections[oid[0]];
                } else {
                    self.selectedSections = [];
                }
            
            } else {
                if (oid.length !== 1) {
                    domNode.innerHTML = "&nbsp;<br>Select a single element in order to see object properties."
                    return;
                };
            
                domNode.innerHTML = "";
                
                if (oid.length) {
                    var o = models["1"].model.objects[oid[0]];
                    
                    renderAttributes(o);
                    
                    o.properties.forEach(function(pset) {
                        renderPSet(pset);
                    });
                }
                
                /* o.getIsDefinedBy(function(isDefinedBy){
                    if (isDefinedBy.getType() == "IfcRelDefinesByProperties") {
                        isDefinedBy.getRelatingPropertyDefinition(function(pset){
                            if (pset.getType() == "IfcPropertySet") {
                                renderPSet(pset);
                            }
                        });
                    }
                }); */
            
            }
        };
        
        this.renderAll = function() {
            self.highlightMode = true;
            self.sections = {};
            Object.keys(models).forEach(function(m) {
                var model = models[m].model;
                if (model.source === 'XML') {
                    Object.keys(model.objects).forEach(function(o) {
                        var ob = model.objects[o];
                        console.log(ob);
                        var li = self.sections[ob.guid] = [];
                        li.push(renderAttributes(ob));                        
                        ob.properties.forEach(function(pset) {
                            li.push(renderPSet(pset));
                        });
                    });
                }
            });
        };
        
        self.setSelected([]);
    };
    
    MetaDataRenderer.prototype = Object.create(EventHandler.prototype);

    return MetaDataRenderer;
    
});
