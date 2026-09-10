\set ON_ERROR_STOP 0
\pset pager off

insert into auth.users (id, email) values
  ('aaaaaaaa-0000-0000-0000-000000000002','veina@test.local') on conflict do nothing;
insert into public.profiles (id, full_name) values
  ('aaaaaaaa-0000-0000-0000-000000000002','Veina') on conflict do nothing;

set role authenticated;
select set_config('request.jwt.claim.sub','aaaaaaaa-0000-0000-0000-000000000001', false);
select set_config('request.jwt.claims','{"sub":"aaaaaaaa-0000-0000-0000-000000000001","user_metadata":{"name":"Javi"}}', false);

\echo ''
\echo '### T1 · list_my_organizations existix i torna les 12 columnes'
select id is not null as te_id, name, lema, role from public.list_my_organizations('bbbbbbbb-0000-0000-0000-000000000001');

\echo ''
\echo '### T2 · create_organization torna lema (forma unica)'
select public.create_organization(
  'bbbbbbbb-0000-0000-0000-000000000001','company','Forn del Poble','forn-del-poble','Pa de llenya','Forn tradicional', null
) -> 'lema' as lema_retornat;

\echo ''
\echo '### T3 · entity/city_hall: missatge clar, no error opac RLS'
select public.create_organization(
  'bbbbbbbb-0000-0000-0000-000000000001','city_hall','Ajuntament','ajuntament','','', null);

\echo ''
\echo '### T4 · UPDATE del nom i el lema (soc owner) → HA DE FUNCIONAR'
update public.organizations set name = 'El Rentonar SCV', lema = 'Fem xarxa al territori'
where slug = 'el-rentonar';
select name, lema from public.organizations where slug = 'el-rentonar';

\echo ''
\echo '### T5 · NEGATIU · canviar el slug (identitat) → HA DE FALLAR'
update public.organizations set slug = 'altre-slug' where slug = 'el-rentonar';

\echo ''
\echo '### T6 · NEGATIU · fer publica una organitzacio de membres → HA DE FALLAR'
update public.organizations set visibility = 'members' where slug = 'el-rentonar';

\echo ''
\echo '### T7 · Afegir una veina com a membre → HA DE FUNCIONAR'
insert into public.organization_memberships (organization_id, tenant_id, user_id, role)
select id, tenant_id, 'aaaaaaaa-0000-0000-0000-000000000002', 'member'
from public.organizations where slug='el-rentonar';
select count(*) as membres from public.organization_memberships m
join public.organizations o on o.id = m.organization_id where o.slug='el-rentonar';

\echo ''
\echo '### T8 · NEGATIU · afegir un segon owner → HA DE FALLAR'
insert into public.organization_memberships (organization_id, tenant_id, user_id, role)
select id, tenant_id, 'aaaaaaaa-0000-0000-0000-000000000002', 'owner'
from public.organizations where slug='forn-del-poble';

\echo ''
\echo '### T9 · NEGATIU · la veina (membre ras) intenta editar l organitzacio → HA DE FALLAR'
select set_config('request.jwt.claim.sub','aaaaaaaa-0000-0000-0000-000000000002', false);
update public.organizations set name = 'Segrestada' where slug = 'el-rentonar';
select name from public.organizations where slug='el-rentonar';

\echo ''
\echo '### T10 · NEGATIU · la veina intenta pujar-se a admin → HA DE FALLAR'
update public.organization_memberships set role = 'admin'
where user_id = 'aaaaaaaa-0000-0000-0000-000000000002';
select role from public.organization_memberships where user_id='aaaaaaaa-0000-0000-0000-000000000002';

\echo ''
\echo '### T11 · La veina se n ix ella mateixa → HA DE FUNCIONAR'
delete from public.organization_memberships where user_id = 'aaaaaaaa-0000-0000-0000-000000000002';
select count(*) as li_queden from public.organization_memberships where user_id='aaaaaaaa-0000-0000-0000-000000000002';

\echo ''
\echo '### T12 · NEGATIU · el propietari no pot esborrar-se a si mateix'
select set_config('request.jwt.claim.sub','aaaaaaaa-0000-0000-0000-000000000001', false);
delete from public.organization_memberships
where user_id = 'aaaaaaaa-0000-0000-0000-000000000001'
  and organization_id = (select id from public.organizations where slug='el-rentonar');
select count(*) as owner_intacte from public.organization_memberships
where user_id='aaaaaaaa-0000-0000-0000-000000000001'
  and organization_id = (select id from public.organizations where slug='el-rentonar');

reset role;
