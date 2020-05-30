$(document).ready(function(){
    var form = $(".ajax-form");
    form.on("submit", function(e) {
        var send=false;
        e.preventDefault();
        
        $(this).find('input').on('focus', function(){
                    $(this).removeClass('error');
            })
            
        if ($(this).find("input[name='ctel']").val() === "") {
                    $(this).find("input[name='ctel']").addClass('error');
                    send = false;
            }else{
                    send = true;
            }

            var formData = new FormData($(this)[0]);

         if (send === true) {
             $.ajax({
                type: "POST",
                url: "/test/send.php",
                processData: false,
                contentType: false,
                data: formData
            }).success(function() {
                form.find("input[name!='ctip']").val('');
                $('a.close-reveal-modal').trigger('click');
                $('a.sp').trigger('click');
                setTimeout(function() {                                         
                $('a.close-reveal-modal').trigger('click');}, 
                3000);
                //yaCounter23718715.reachGoal(citem);
            });
        }

    });
});
