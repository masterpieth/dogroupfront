$(function() {
    showList(1)
    function showList(currentPage) {
        $.ajax({
            url: backURL + 'wallet/list/' + currentPage,
            xhrFields: {
                withCredentials: true,
            },
            data : {
                'currentPage' : currentPage
            },
            success: function(jsonObj) {
                console.log(jsonObj)
                let $trOrigin = $('table > tbody > tr:eq(0)')
                $trOrigin.show()
                $('table > tbody').html('')
                let walletList = jsonObj.list
                $(walletList).each(function(index, item) {
                    let $trCopy = $trOrigin.clone();
                    $trCopy.find('td:eq(0)').html(item.transactionNo)
                    $trCopy.find('td:eq(1)').html(item.transactionDate)
                    let oldBalance = 0
                    let priceStr = ''
                    let categoryStr = ''
                    switch(item.transactionCategory) {
                        case 1:
                        case 3:
                        case 5:
                            priceStr += '+' + item.transactionMoney
                            oldBalance = item.walletBalance - item.transactionMoney
                            break;
                        case 2:
                        case 4:
                            priceStr += '-' + item.transactionMoney
                            oldBalance = item.walletBalance + item.transactionMoney
                            break;
                    }
                    switch(item.transactionCategory) {
                        case 1:
                            categoryStr = '정산금액(환급금)'
                            break;
                        case 2:
                            categoryStr = '입장료'
                            break;
                        case 3:
                            categoryStr = '충전금'
                            break;
                        case 4:
                            categoryStr = '인출금'
                            break;
                        case 5:
                            categoryStr = '환불금'
                            break;
                    }
                    $trCopy.find('td:eq(2)').html(categoryStr)
                    if(item.study != null) {
                        $trCopy.find('td:eq(3)').html(item.study.studyTitle)
                    } else {
                        $trCopy.find('td:eq(4)').html(item.transactionUser)
                    }
                    $trCopy.find('td:eq(5)').find('span:eq(0)').html('\\' + oldBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
                    $trCopy.find('td:eq(5)').find('span:eq(1)').html(priceStr.replace(/\B(?=(\d{3})+(?!\d))/g, ","))
                    $trCopy.find('td:eq(5)').find('span:eq(3)').html('\\' + item.walletBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
                    $('table > tbody').append($trCopy)
                })
            }, error: function() {
    
            }
        })
    }
})