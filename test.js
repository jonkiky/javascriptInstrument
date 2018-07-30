$(".button-collapse").sideNav();
	$(".in-community").hide();
	$("#show_slide").click(function() {
		$('.button-collapse').sideNav('show');
	});
	$(".modal").modal({
		startingTop: '50%'
	});
	

	
	var flagSuperNoteGetDone = false
	var flagGetNoteFromLocalDB = false
	var note_info=[]
	var localdb_info=[]
	

	function getNote(){
		var projectdata = {
				"database" : "super_talk",
				"token" :  super_token,
				"tid" : thread_id
				
			};
		$.ajax({
			url :  "/WSG/thread/note/get/gourpbycommunityid",
			type : "POST",
			data : JSON.stringify(projectdata),
			dataType : "json",
			success : function(data) {
				var json = $.parseJSON(data.obj);
				if(null!=json&&data.code!="failure"){
					current_community = ""
					note_ids =""
					for(var i in json){
						if((current_community==json[i].community_id||current_community=="")&&i<json.length-1){
							// get all note belongs to a community
							current_community=json[i].community_id
							note_ids=note_ids+",'"+json[i].note_id+"'"
						}else{
							// get these note information
							if(i==json.length-1)// get last one 
							{
								current_community=json[i].community_id
								note_ids=note_ids+",'"+json[i].note_id+"'"
							}
							getLocaldbByCommunityId(note_ids,current_community)
							current_community=json[i].community_id
							note_ids=",'"+json[i].note_id+"'"
						}
						
						
					}
					flagSuperNoteGetDone =true
					
					
				}
				
			}})
		
	}
	
	 getNote()