@include('assets.google')

<title>Masked Stories | Don't look who's talking</title>
<link rel="shortcut icon" href="{{ asset('/favicon.png') }}">
<link rel="apple-touch-icon" href="{{ asset('/apple-shortcut-icon.png') }}">

<meta property="og:site_name" content="Masked Stories | Don't look who's talking">
<meta property="og:title" content="Masked Stories | Don't look who's talking" />
<meta property="og:type" content="website" />
<meta property="og:url" content="{{ url('/')}}" />
<meta property="og:description"
      content="Create an account and start sharing your stories and ideas anonymously to Facebook. Or just read what people are saying behind a mask." />
<meta property="og:image:secure_url" itemprop="image" content="{{ asset('/thumbnail.png') }}" />
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="627" />

<meta property="fb:app_id" content="351732932455775">
<meta name="description" content="Create an account and start sharing your stories and ideas anonymously to Facebook. Or just read what people are saying behind a mask.">
<meta name="keywords" content="stories stories, masked stories, anonymous facebook posting, stories for instagram, stories in hindi, stories with morals, no social media judgment, real life love stories, free online stories, breakup stories, heartbreak stories">

<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

@include('assets.css')

<script type="text/javascript">
    var base_url = {!! json_encode(url('/api')) !!} ;
    var base_url_public = {!! json_encode(url('/')) !!} ;
</script>
