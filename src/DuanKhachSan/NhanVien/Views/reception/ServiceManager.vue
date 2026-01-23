<template>
    <div>
        <h4 class="fw-bold py-3 mb-4">Danh sách Dịch vụ / Menu</h4>
        <div class="row">
            <div class="col-md-4 col-lg-3 mb-4" v-for="i in 8" :key="i">
                <div class="card h-100">
                    <img class="card-img-top" src="https://via.placeholder.com/300x200" alt="Card image cap" />
                    <div class="card-body">
                        <h5 class="card-title">Mì bò trứng {{ i }}</h5>
                        <p class="card-text text-success fw-bold">45.000 đ</p>
                        <button class="btn btn-outline-primary w-100">
                            <i class='bx bx-plus'></i> Thêm vào đơn
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>