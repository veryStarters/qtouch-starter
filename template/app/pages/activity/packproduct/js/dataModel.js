module.exports = (function () {

    var store = [],
        productList = [],
        /**
         * wiki:
         * http://wiki.corp.qunar.com/pages/viewpage.action?pageId=105915774
         */
        selected = {
            totalPrice: '0',
            totalPtPrice: '0',
            bookInfo: '',
            extra: '',
            packProducts: []
        },
        selectedExt = {},
        groupPrd;

    var calculate = function () {
        var totalPrice = 0,
            totalPtPrice = 0;
        _.each(selected.packProducts, (item) => {
            totalPrice += parseFloat(item.price);
            totalPtPrice += parseFloat(item.ptPrice);
        });

        selected.totalPrice = parseFloat(totalPrice.toFixed(2)).toString();
        selected.totalPtPrice = parseFloat(totalPtPrice.toFixed(2)).toString();
    };

    return {
        //初始化仓库
        setStore: function (data, _groupPrd) {
            store = data;
            groupPrd = _groupPrd || [];
            
            _.each(store, (item) => {
                productList = productList.concat(item.productInfos);
            });
        },
        /**
         * @param  {Object} data
         * {
         *     productId: '123',  //产品ID
         *     count: 10, //数量
         *     forePrd: true, 是否是搭售
         *     select: true //选中
         * }
         */
        update: function (data) {

            var index = -1,
                product,
                price;
                
            var sExt = selectedExt[data.productId];

            //在选中产品中查找对应的产品索引
            //underscore版本太低没 _.findIndex
            for (var i = 0, len = selected.packProducts.length; i < len; i++) {
                if (selected.packProducts[i].productId == data.productId) {
                    index = i;
                    break;
                }
            }

            //查找是否有产品ID在搭售里面
            var forePrd = _.find(groupPrd, function(item) {
                return item.productId == data.productId;
            });
            
            if(forePrd) {
                if(data.select && !data.forePrd){
                    data.count += forePrd.minCount;
                }
                else {
                    data.count = forePrd.minCount;   
                }
                data.select = true;
            }

            if (data.select) {

                //不存在则插入一条记录
                if (index === -1) {

                    product = _.filter(productList, (item) => {
                        return item.productId == data.productId;
                    });

                    
                    if (
                        //可售的才被加入选中
                        (product[0] && product[0].saleType == 1)
                        //如果是跳转url扩展返回的，sExt里面有数据能被选中
                        && ( 
                            (product[0].packBookingUrl === '')  //非url跳转
                            || (product[0].packBookingUrl !== '' && sExt)  //url跳转返回且sExt有数据
                        )
                    ) {

                        //加到最后
                        selected.packProducts.push({
                            productId: data.productId,
                            title: product[0].title,

                            //算出总价格  套餐 + 自选
                            //price: product[0].salePrice.toString(),

                            originalPrice: product[0].originalPrice.toString(),
                            ptType: 1,
                            ptPrice: 0, // count * perPtPrice
                            saleStrategy: 0,
                            count: product[0].defaultCount,
                            unit: product[0].unit,
                            extra: product[0].extra || '{}',

                            //自定义保留字段,直减
                            salePrice: product[0].salePrice.toString()
                            
                        });

                        index = selected.packProducts.length - 1;
                    }
                }

                if(index > -1 && data.count !== undefined) {
                    
                    //如果是跳转url扩展返回的，直接用扩展里面的价格
                    if(sExt) {
                        price = parseFloat(
                            parseFloat(sExt.price).toFixed(2)
                        ).toString();
                        selected.packProducts[index].count = sExt.num;
                    }
                    else {
                        selected.packProducts[index].count = data.count;
                        price = parseFloat( 
                            (parseFloat(selected.packProducts[index].salePrice) * data.count).toFixed(2) 
                        ).toString();

                        if(forePrd) {
                            price = parseFloat( 
                                (
                                    (parseFloat(forePrd.salePrice) * forePrd.minCount) //套餐价格
                                    + (parseFloat(selected.packProducts[index].salePrice) * (data.count - forePrd.minCount)) //自选价格
                                ).toFixed(2)
                            ).toString();
                        }
                    } 
                    
                    selected.packProducts[index].price = price;

                    if(forePrd) {
                        selected.packProducts[index].ptPrice = forePrd.perPtPrice * forePrd.minCount;
                    }
                }
            }
            else {
                //存在则删除
                index > -1 && selected.packProducts.splice(index, 1);
            }

            calculate();

            return selected;
        },
        //根据productid获取 extra
        getExt: function(pid) {
            if(pid === undefined) {
                return selectedExt;
            }
            return selectedExt[pid] || {};
        },
        setExt: function(pid, data) {
            selectedExt[pid] = data;
        },
        //返回结果
        getResult: function () {
            return selected;
        }
    }
}());