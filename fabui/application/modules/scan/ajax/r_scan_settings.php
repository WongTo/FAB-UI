<div class="row">
    <div class="col-sm-6">
    	<h6 class="text-primary">Select scan quality</h6>
    </div>
</div>

<div class="row">
	<div class="col-sm-12">
		<div class="well well-light">
			<div class="row margin-bottom-10" style="margin-top: 10px;">
				<div class="col-sm-12">
					<div class="text-center img-quality-container margin-bottom-10">
						<img class="img-responsive img-quality-container" style="display: inline; max-width: 200px;" src="application/modules/scan/assets/img/duck0.png">
					</div>
					<div id="scan-quality" class="noUiSlider fab-slider"></div>
				</div>
			</div>
			<div class="row">
				<div class="col-sm-12">
					<h5>
						Quality:
						<strong><span id="quality"></span></strong>
					</h5>
					<p id="quality-description"></p>
				</div>
			</div>
		</div>
	</div>
</div>

<script type="text/javascript">
/*  SCAN QUALITY SLIDER */
$("#scan-quality").noUiSlider({
    range: {'min': 20, 'max' : 100},
    /*range: [20, 100],*/
    start: 0,
    step: 20,
    connect: 'lower',
    handles: 1,
    behaviour: 'tap-drag' 
 });
/* SCAN QUALITY SLIDER EVENTS */
 $("#scan-quality").on({
	 slide: manageSlide,
	 set: manageSlide,
	 change: manageSlide
});


$("#scan-quality").val( 20, {
	set: true,
	animate: true
});

</script>

