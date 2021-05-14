<!DOCTYPE html>
<html lang="en" translate="no">
<head>
    @include('includes._header')
</head>
<body>

@include('includes._nav')

<div class="container py-3">
    <div class="row mb-3">
        <h1>Masked Stories</h1>
        <h2>Don't look who's talking</h2>
        <div class="col-lg-8 text-white py-2 text-center mx-auto" style="height: 200px">
            <img id="logo_svg" class="mb-4" src="{{asset('/logo.svg')}}" height="40%" alt="masked-stories-logo">
            <p class="lead mb-0"> "Man is least himself when he talks in his own person. Give him a mask, and he will tell you the truth" - Oscar Wilde </p>
        </div>
    </div>
    @yield('content')
</div>

@include('includes._howItWorks')

@include('includes._footer')

@include('includes._modals')

@include('assets.js')
</body>
</html>
