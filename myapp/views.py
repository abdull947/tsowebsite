from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .models import Feedback, Member, GalleryImage, Director, Registration, Announcement, Alumni
import requests
from django.http import JsonResponse
def _is_admin(request):
    return request.user.is_authenticated and request.user.is_staff


def home(request):
    director = Director.objects.first()
    gallery_images = GalleryImage.objects.filter(is_active=True).order_by('order')
    alumni = Alumni.objects.filter(is_active=True).order_by('order')
    return render(request, 'index.html', {
        'director': director,
        'gallery_images': gallery_images,
        'alumni': alumni,
        'is_admin': _is_admin(request),
    })


def about(request):
    return render(request, 'about.html')


def members_page(request):
    tso_members = Member.objects.filter(is_active=True, member_type='TSO').order_by('order')
    cabinet_members = Member.objects.filter(is_active=True, member_type='CABINET').order_by('order')
    donators = Member.objects.filter(is_active=True, member_type='DONATOR').order_by('order')
    return render(request, 'members.html', {
        'tso_members': tso_members,
        'cabinet_members': cabinet_members,
        'donators': donators,
        'is_admin': _is_admin(request),
    })


def join_page(request):
    return render(request, 'join.html')


def contact(request):
    return render(request, 'contact.html')


# ─── API: Announcement ────────────────────────────────────────────────────────
def api_announcement(request):
    ann = Announcement.objects.filter(is_active=True).first()
    if ann:
        return JsonResponse({'active': True, 'title': ann.title, 'message': ann.message})
    return JsonResponse({'active': False})


# ─── API: Members CRUD ────────────────────────────────────────────────────────
def _member_to_dict(m):
    return {
        'id': m.id,
        'name': m.name,
        'role': m.role,
        'member_type': m.member_type,
        'education': m.education or '',
        'job_designation': m.job_designation or '',
        'order': m.order,
        'photo': m.photo.url if m.photo else None,
    }


@csrf_exempt
@require_http_methods(['GET', 'POST'])
def api_members(request):
    if request.method == 'GET':
        mtype = request.GET.get('type', '')
        qs = Member.objects.filter(is_active=True)
        if mtype:
            qs = qs.filter(member_type=mtype)
        return JsonResponse({'members': [_member_to_dict(m) for m in qs]})

    if not _is_admin(request):
        return JsonResponse({'success': False, 'error': 'Unauthorized'}, status=403)

    # POST — multipart FormData (supports photo upload)
    name = request.POST.get('name', '').strip()
    role = request.POST.get('role', '').strip()
    member_type = request.POST.get('member_type', 'TSO')
    education = request.POST.get('education', '').strip() or None
    job_designation = request.POST.get('job_designation', '').strip() or None
    photo = request.FILES.get('photo')

    m = Member(
        name=name, role=role, member_type=member_type,
        education=education, job_designation=job_designation,
    )
    if photo:
        m.photo = photo
    m.save()
    return JsonResponse({'success': True, 'member': _member_to_dict(m)})


@csrf_exempt
@require_http_methods(['PUT', 'POST', 'DELETE'])
def api_member_detail(request, pk):
    if not _is_admin(request):
        return JsonResponse({'success': False, 'error': 'Unauthorized'}, status=403)

    try:
        m = Member.objects.get(pk=pk)
    except Member.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Not found'}, status=404)

    if request.method == 'DELETE':
        m.is_active = False
        m.save()
        return JsonResponse({'success': True})

    # PUT/POST — multipart FormData
    m.name = request.POST.get('name', m.name).strip()
    m.role = request.POST.get('role', m.role).strip()
    m.member_type = request.POST.get('member_type', m.member_type)
    edu = request.POST.get('education', '').strip()
    job = request.POST.get('job_designation', '').strip()
    m.education = edu or None
    m.job_designation = job or None
    photo = request.FILES.get('photo')
    if photo:
        m.photo = photo
    m.save()
    return JsonResponse({'success': True, 'member': _member_to_dict(m)})


# ─── API: Gallery CRUD ────────────────────────────────────────────────────────
def _gallery_to_dict(g):
    return {
        'id': g.id,
        'image': g.image.url if g.image else None,
        'caption': g.caption or '',
        'order': g.order,
    }


@csrf_exempt
@require_http_methods(['GET', 'POST'])
def api_gallery(request):
    if request.method == 'GET':
        imgs = GalleryImage.objects.filter(is_active=True).order_by('order')
        return JsonResponse({'images': [_gallery_to_dict(g) for g in imgs]})

    if not _is_admin(request):
        return JsonResponse({'success': False, 'error': 'Unauthorized'}, status=403)

    # POST — upload new image
    caption = request.POST.get('caption', '').strip()
    order = int(request.POST.get('order', 0))
    image = request.FILES.get('image')
    if not image:
        return JsonResponse({'success': False, 'error': 'No image provided.'})
    g = GalleryImage.objects.create(image=image, caption=caption, order=order, is_active=True)
    return JsonResponse({'success': True, 'image': _gallery_to_dict(g)})


@csrf_exempt
@require_http_methods(['DELETE'])
def api_gallery_detail(request, pk):
    if not _is_admin(request):
        return JsonResponse({'success': False, 'error': 'Unauthorized'}, status=403)

    try:
        g = GalleryImage.objects.get(pk=pk)
    except GalleryImage.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Not found'}, status=404)
    g.is_active = False
    g.save()
    return JsonResponse({'success': True})


# ─── API: Feedback ────────────────────────────────────────────────────────────
@csrf_exempt
@require_http_methods(['POST'])
def submit_feedback(request):
    try:
        data = json.loads(request.body)
        name = data.get('name', '').strip()
        message = data.get('message', '').strip()
        rating = int(data.get('rating', 0))
        if not name or not message or not (1 <= rating <= 5):
            return JsonResponse({'success': False, 'error': 'Invalid data.'})
        Feedback.objects.create(name=name, message=message, rating=rating)
        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})


# ─── API: Registration ────────────────────────────────────────────────────────
@csrf_exempt
@require_http_methods(['POST'])
def submit_registration(request):
    try:
        data = json.loads(request.body)
        reg_type = data.get('reg_type', 'TSO')
        Registration.objects.create(
            full_name=data.get('name', '').strip(),
            father_name=data.get('fname', '').strip(),
            email=data.get('email', '').strip(),
            phone=data.get('phone', '').strip(),
            area=data.get('area', '').strip(),
            reg_type=reg_type,
            institution=data.get('inst', '').strip() or None,
            program=data.get('prog', '').strip() or None,
            education=data.get('education', '').strip() or None,
            job_designation=data.get('job_designation', '').strip() or None,
        )
        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})



#for donation

SHEET_ID = '1-9UH3SbuNAfauuabZFLoJTc4gd2XNGTTnKiwZt0zSdo'
SHEET_URL = f'https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:json&sheet=Sheet1'
def fetch_sheet_data():
    try:
        response = requests.get(SHEET_URL, timeout=10)
        text = response.text

        json_text = text[text.index('{'):text.rindex('}')+1]
        data = json.loads(json_text)

        rows = data.get('table', {}).get('rows', [])

        months = ['September','October','November','December',
                  'January','February','March','April','May','June','July','August']

        donors = []
        monthly_totals = {m: 0 for m in months}

        for row in rows:
            cells = row.get('c', [])

            if not cells or len(cells) < 2 or not cells[1] or not cells[1].get('v'):
                continue

            name = str(cells[1]['v']).strip()

            if name.lower() in ['total', 'name']:
                continue

            donor = {'name': name, 'months': {}, 'total': 0}

            month_cols = [2,3,4,5,6,7,8,9,10,11,12,13]

            for i, col_idx in enumerate(month_cols):
                amount = float(cells[col_idx]['v']) if col_idx < len(cells) and cells[col_idx] and cells[col_idx].get('v') else 0
                donor['months'][months[i]] = amount
                monthly_totals[months[i]] += amount

            donor['total'] = float(cells[14]['v']) if len(cells) > 14 and cells[14] and cells[14].get('v') else sum(donor['months'].values())
            donors.append(donor)

        return donors, monthly_totals

    except Exception as e:
        print("Sheet Error:", e)
        return [], {}
def donation_dashboard(request):
    donors, monthly_totals = fetch_sheet_data()

    return render(request, 'donations/dashboard.html', {
        'donors': donors,
        'monthly_totals': monthly_totals,
    })
def donation_api(request):
    donors, monthly_totals = fetch_sheet_data()
    return JsonResponse({
        "donors": donors,
        "monthly_totals": monthly_totals
    })
