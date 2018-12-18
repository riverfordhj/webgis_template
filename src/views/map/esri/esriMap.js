export const createMap = function (esriLoader, options, self, yunnanJson) {
    esriLoader.loadModules(
            [
                'esri/Map',
                "esri/Basemap",
                "esri/Viewpoint",
                "esri/Graphic",
                'esri/views/MapView',
                "esri/layers/FeatureLayer",
                "esri/layers/WebTileLayer",
                "esri/layers/TileLayer",
                "esri/layers/GraphicsLayer",
                "esri/widgets/Expand",
                "esri/widgets/Home",
                "esri/widgets/LayerList",
                "esri/widgets/BasemapGallery",
                "esri/widgets/Legend",
                "esri/widgets/Compass",
                "esri/widgets/Print",
                "esri/core/urlUtils",
            ], options)
        .then(
            ([
                Map,
                Basemap,
                Viewpoint,
                Graphic,
                MapView,
                FeatureLayer,
                WebTileLayer,
                TileLayer,
                GraphicsLayer,
                Expand,
                Home,
                LayerList,
                BasemapGallery,
                Legend,
                Compass,
                Print,
                urlUtils
            ]) => {

                // urlUtils.addProxyRule({
                //     urlPrefix: "http://202.114.148.160//arcgis_js_api4.8",
                //     proxyUrl: "http://202.114.148.160/DotNet/proxy.ashx"
                // });

                function ConstructBasemap() {
                    //地图底图
                    const ESRIvectorBaselayer = new TileLayer({
                        url: "https://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer"
                    })

                    const ESRIVectorBasemap = new Basemap({
                        baseLayers: [ESRIvectorBaselayer],
                        title: "ESRI矢量图",
                        thumbnailUrl: "https://www.arcgis.com/sharing/rest/content/items/fb84ad313bd3432983488ed1ba1d5bf3/info/thumbnail/ago_downloaded.png?f=json"
                    });

                    const ESRIrasterBaselayer = new TileLayer({
                        url: "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer",
                    })

                    const ESRIRasterBasemap = new Basemap({
                        baseLayers: [ESRIrasterBaselayer],
                        title: "ESRI影像图",
                        thumbnailUrl: "https://www.arcgis.com/sharing/rest/content/items/25cefd52161e44b8a5eec87768f79079/info/thumbnail/thumbnail.jpeg?f=json"
                    });

                    const rasterTileLayer = new WebTileLayer({
                        urlTemplate: "http://{subDomain}.tianditu.com/DataServer?T=img_w&x={col}&y={row}&l={level}",
                        subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
                        copyright: "天地图影像"
                    });

                    const vectorTileLayer = new WebTileLayer({
                        urlTemplate: "http://{subDomain}.tianditu.com/DataServer?T=vec_w&x={col}&y={row}&l={level}",
                        subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
                        copyright: "天地图矢量"
                    });

                    const imgAnnotationTileLayer = new WebTileLayer({
                        urlTemplate: "http://{subDomain}.tianditu.com/DataServer?T=cia_w&x={col}&y={row}&l={level}",
                        subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
                        copyright: "天地图影像"
                    });

                    const vecAnnotationTileLayer = new WebTileLayer({
                        urlTemplate: "http://{subDomain}.tianditu.com/DataServer?T=cva_w&x={col}&y={row}&l={level}",
                        subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
                        copyright: "天地图矢量"
                    });

                    const grayLayer = new TileLayer({
                        url: "https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer",
                    })

                    const vecBasemap = new Basemap({
                        baseLayers: [vectorTileLayer, vecAnnotationTileLayer],
                        title: "天地矢量",
                        thumbnailUrl: "https://www.arcgis.com/sharing/rest/content/items/fb84ad313bd3432983488ed1ba1d5bf3/info/thumbnail/ago_downloaded.png?f=json"
                    });

                    const imgBasemap = new Basemap({
                        baseLayers: [rasterTileLayer, imgAnnotationTileLayer],
                        title: "天地影像",
                        thumbnailUrl: "https://www.arcgis.com/sharing/rest/content/items/25cefd52161e44b8a5eec87768f79079/info/thumbnail/thumbnail.jpeg?f=json"
                    });

                    const gray = new Basemap({
                        baseLayers: [grayLayer],
                        title: "灰色图",
                        thumbnailUrl: "https://www.arcgis.com/sharing/rest/content/items/74e992f4fce3450aaf57a9a0df0007c3/info/thumbnail/cn_canvas.jpg?f=json"
                    })

                    //底图数组
                    return [ESRIVectorBasemap, ESRIRasterBasemap, vecBasemap, imgBasemap, gray];
                }

                function ConstructYunnanmap() {
                    //云南json图层
                    var yunnanlayer = new GraphicsLayer({
                        title: "云南省界图层"
                    });
                    // Create a symbol for rendering the graphic
                    var fillSymbol = {
                        type: "simple-fill", // autocasts as new SimpleFillSymbol()
                        color: [227, 139, 79, 0.8],
                        outline: { // autocasts as new SimpleLineSymbol()
                            color: [200, 200, 255],
                            width: 3
                        }
                    };

                    for (let i = 0; i < yunnanJson.features.length; i++) {
                        // debugger
                        let polygon = {
                            type: "polygon", // autocasts as new Polygon()
                            rings: yunnanJson.features[i].geometry.rings
                        };
                        let polygonGraphic = new Graphic({
                            geometry: polygon,
                            symbol: fillSymbol
                        });

                        yunnanlayer.add(polygonGraphic);
                    }
                    return yunnanlayer;
                }

                const basemaps = ConstructBasemap();

                var yunnanlayer = ConstructYunnanmap();

                //地图
                const map = new Map({
                    basemap: 'satellite',
                    layers: [yunnanlayer] //,self.xbLayer,  gralayer
                });

                self.view = new MapView({
                    map: map,
                    container: 'map',
                    zoom: 7,
                    center: [101.0, 25.2],
                });

                //窗口组件
                yunnanlayer.when(() => {
                    // self.view.goTo(self.xbLayer.fullExtent);

                    const homeWidget = new Home({
                        view: self.view,
                        viewpoint: new Viewpoint({
                            targetGeometry: yunnanlayer.fullExtent
                        })
                    });

                    self.view.ui.add([{
                        component: homeWidget,
                        position: "top-left",
                        index: 1
                    }])
                });

                const basemapGallery = new BasemapGallery({
                    view: self.view,
                    container: document.createElement("div"),
                    source: basemaps
                });

                const bgExpand = new Expand({
                    view: self.view,
                    content: basemapGallery.container,
                    expandIconClass: "esri-icon-basemap"
                });

                //图层管理
                const layerList = new LayerList({
                    view: self.view,
                    // listItemCreatedFunction: defineActions
                });

                const layerExp = new Expand({
                    view: self.view,
                    content: layerList
                });

                const compass = new Compass({
                    view: self.view,
                    viewpoint: new Viewpoint({
                        targetGeometry: yunnanlayer.fullExtent
                    })
                });

                self.view.ui.add([{
                        component: bgExpand,
                        position: "top-right",
                        index: 0
                    },
                    {
                        component: layerExp,
                        position: "top-right",
                        index: 1
                    },
                    {
                        component: compass,
                        position: "top-left",
                        index: 2
                    },
                ]);
            })
        .catch(err => {
            console.error(err);
        });
}