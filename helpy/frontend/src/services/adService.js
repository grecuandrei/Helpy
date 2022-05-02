import http from "../api/config";

const headers = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

class AdDataService {
  getAll() {
    return http.get("/ads");
  }

  get(id) {
    return http.get(`/ads/${id}`);
  }

  create(data) {
    return http.ad("/ads", data, headers(data.get("token")));
  }

  update({ id, data }) {
    return http.put(`/ads/${id}`, data, headers(data.get("token")));
  }

  delete({ id, token }) {
    return http.delete(`/ads/${id}`, headers(token));
  }

  deleteAll(token) {
    return http.delete("/ads", headers(token));
  }

  findByTitle(title) {
    return http.get(`/ads?title=${title}`);
  }

  like(data) {
    return http.patch(`/ads/${data.id}/likeAd`, {}, headers(data.token));
  }
}

export default new AdDataService();
