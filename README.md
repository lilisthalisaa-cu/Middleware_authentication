Nama : Lilis Thalisa
Nim  : 362458302020

Kriteria Fungsionalitas
1. Terapkan middleware authenticateToken pada endpoint POST /directors.
2. Terapkan array middleware [authenticateToken, authorizeRole(’admin’)]
pada endpoint berikut:
• PUT /directors/:id
• DELETE /directors/:id
3. Biarkan endpoint GET /directors dan GET /directors/:id tetap publik.
4. Koleksi Postman (.json): File ekspor dari Collection Postman Anda. Koleksi ini harus
mencakup pengujian untuk:
• Login sebagai ”user” dan mencoba menghapus sutradara (gagal 403).
• Login sebagai ”admin” dan mencoba menghapus sutradara (berhasil 204).
5. Hasil
Put untuk user biasa

<img width="1920" height="1128" alt="put user biasa" src="https://github.com/user-attachments/assets/d71cb348-074f-41f7-820c-0e14023e9094" />

Delete untuk user biasa

<img width="1920" height="1128" alt="delete user biasa" src="https://github.com/user-attachments/assets/04dc1795-c9a0-4f58-8a77-0afcd9a90c76" />

Put untuk user admin

<img width="1920" height="1128" alt="put user admin" src="https://github.com/user-attachments/assets/c1d02465-c982-418a-a168-f086602b0d7c" />

Delete untuk user admin

<img width="1920" height="1128" alt="delete user admin" src="https://github.com/user-attachments/assets/895d0406-9aea-4fcb-80b4-9d6a3269a6bd" />

