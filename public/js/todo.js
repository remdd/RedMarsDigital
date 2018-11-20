$(() => {
	$('#addCategoryBtn').click(() => {
		var newCategory = {
			name: $('#newCategory').val()
		}
		$.ajax("/todo/cat", {
			data: newCategory,
			type: 'post'
		}).done(() => {
			location.reload();
		});
	});

	$('#addToDoBtn').click(() => {
		console.log('adding todo...');
		var newToDo = {
			name: $('#newToDo').val(),
			cat: $('#catList').val()
		}
		console.log(newToDo.cat);
		$.ajax("/todo/newToDo", {
			data: newToDo,
			type: 'post'
		}).done(() => {
			window.location.href = '/todo/'
		});
	});

	$('.toDoItem span').click(function() {
		var itemName = $(this).parent().attr('data-name');
		var $that = $(this);
		$.ajax("/todo/" + itemName, {
			type: 'put'
		}).done(() => {
			$that.toggleClass('complete');
			if($that.hasClass('complete')) {
				$that.siblings().first().next().addClass('fa-check-circle-o');
				$that.siblings().first().next().removeClass('fa-circle-o');
			} else {
				$that.siblings().first().next().removeClass('fa-check-circle-o');
				$that.siblings().first().next().addClass('fa-circle-o');
			}
		});	
	});

	$('.deleteItemBtn').click(function() {
		console.log('deleting todo...');
		var itemName = $(this).parent().attr('data-name');
		$.ajax('/todo/' + itemName, {
			type:'delete'
		}).done(function() {
			window.location.href = '/todo/'
		});
	});

	$('.deleteCatBtn').click(function() {
		var catName = $(this).parent().attr('data-name');
		$.ajax('/todo/cat/' + catName, {
			type:'delete'
		}).done(function() {
			window.location.href = '/todo/'
		});
	});
});
