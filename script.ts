// Types and Interfaces
type PageType = "start" | "results" | "details";

interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

interface SearchResponse {
  Search: Movie[];
  totalResults: string;
  Response: string;
  Error?: string;
}

interface MovieDetail {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
  Error?: string;
}

// Application State
class AppState {
  private currentPage: PageType = "start";
  private searchQuery: string = "";
  private searchResults: Movie[] = [];
  private totalResults: number = 0;
  private currentPageNumber: number = 1;
  private selectedMovie: MovieDetail | null = null;

  setCurrentPage(page: PageType): void {
    this.currentPage = page;
  }

  getCurrentPage(): PageType {
    return this.currentPage;
  }

  setSearchQuery(query: string): void {
    this.searchQuery = query;
  }

  getSearchQuery(): string {
    return this.searchQuery;
  }

  setSearchResults(results: Movie[], total: number): void {
    this.searchResults = results;
    this.totalResults = total;
  }

  getSearchResults(): Movie[] {
    return this.searchResults;
  }

  getTotalResults(): number {
    return this.totalResults;
  }

  setCurrentPageNumber(page: number): void {
    this.currentPageNumber = page;
  }

  getCurrentPageNumber(): number {
    return this.currentPageNumber;
  }

  setSelectedMovie(movie: MovieDetail): void {
    this.selectedMovie = movie;
  }

  getSelectedMovie(): MovieDetail | null {
    return this.selectedMovie;
  }
}

// API Service
class OMDbAPI {
  private readonly apiKey = "507fedbe";
  private readonly baseUrl = "http://www.omdbapi.com/";

  async searchMovies(query: string, page: number = 1): Promise<SearchResponse> {
    const url = `${this.baseUrl}?apikey=${this.apiKey}&s=${encodeURIComponent(
      query
    )}&page=${page}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error searching movies:", error);
      throw new Error("Failed to search movies. Please try again.");
    }
  }

  async getMovieDetails(imdbID: string): Promise<MovieDetail> {
    const url = `${this.baseUrl}?apikey=${this.apiKey}&i=${imdbID}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching movie details:", error);
      throw new Error("Failed to fetch movie details. Please try again.");
    }
  }
}

// UI Controller
class UIController {
  private readonly appState: AppState;
  private readonly apiService: OMDbAPI;

  // DOM Elements
  private startPage!: HTMLElement;
  private resultsPage!: HTMLElement;
  private detailsPage!: HTMLElement;
  private headerContent!: HTMLElement;
  private searchInput!: HTMLInputElement;
  private searchButton!: HTMLButtonElement;
  private resultsSearchInput!: HTMLInputElement;
  private resultsSearchButton!: HTMLButtonElement;
  private resultsGrid!: HTMLElement;
  private pagination!: HTMLElement;
  private detailPoster!: HTMLImageElement;
  private movieInfo!: HTMLElement;
  private ratingsContainer!: HTMLElement;
  private moviePlot!: HTMLElement;
  private backButton!: HTMLButtonElement;
  private loadingOverlay!: HTMLElement;

  constructor() {
    this.appState = new AppState();
    this.apiService = new OMDbAPI();
    this.initializeElements();
    this.bindEvents();
    this.showPage("start");
  }

  private initializeElements(): void {
    this.startPage = document.getElementById("startPage")!;
    this.resultsPage = document.getElementById("resultsPage")!;
    this.detailsPage = document.getElementById("detailsPage")!;
    this.headerContent = document.getElementById("headerContent")!;
    this.searchInput = document.getElementById(
      "searchInput"
    ) as HTMLInputElement;
    this.searchButton = document.getElementById(
      "searchButton"
    ) as HTMLButtonElement;
    this.resultsSearchInput = document.getElementById(
      "resultsSearchInput"
    ) as HTMLInputElement;
    this.resultsSearchButton = document.getElementById(
      "resultsSearchButton"
    ) as HTMLButtonElement;
    this.resultsGrid = document.getElementById("resultsGrid")!;
    this.pagination = document.getElementById("pagination")!;
    this.detailPoster = document.getElementById(
      "detailPoster"
    ) as HTMLImageElement;
    this.movieInfo = document.getElementById("movieInfo")!;
    this.ratingsContainer = document.getElementById("ratingsContainer")!;
    this.moviePlot = document.getElementById("moviePlot")!;
    this.backButton = document.getElementById(
      "backButton"
    ) as HTMLButtonElement;
    this.loadingOverlay = document.getElementById("loadingOverlay")!;
  }

  private bindEvents(): void {
    // Header click - go to start page
    this.headerContent.addEventListener("click", () => {
      this.showPage("start");
    });

    // Search functionality
    this.searchButton.addEventListener("click", () => {
      this.performSearch();
    });

    this.searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.performSearch();
      }
    });

    // Results page search
    this.resultsSearchButton.addEventListener("click", () => {
      this.performSearch();
    });

    this.resultsSearchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.performSearch();
      }
    });

    // Back button
    this.backButton.addEventListener("click", () => {
      this.showPage("results");
    });
  }

  private showLoading(): void {
    this.loadingOverlay.classList.remove("hidden");
  }

  private hideLoading(): void {
    this.loadingOverlay.classList.add("hidden");
  }

  private showPage(page: "start" | "results" | "details"): void {
    // Hide all pages
    this.startPage.classList.add("hidden");
    this.resultsPage.classList.add("hidden");
    this.detailsPage.classList.add("hidden");

    // Show selected page
    switch (page) {
      case "start":
        this.startPage.classList.remove("hidden");
        this.searchInput.focus();
        break;
      case "results":
        this.resultsPage.classList.remove("hidden");
        break;
      case "details":
        this.detailsPage.classList.remove("hidden");
        break;
    }

    this.appState.setCurrentPage(page);
  }

  private async performSearch(page: number = 1): Promise<void> {
    const query =
      this.appState.getCurrentPage() === "start"
        ? this.searchInput.value.trim()
        : this.resultsSearchInput.value.trim();

    if (!query) {
      alert("Please enter a movie title to search.");
      return;
    }

    this.showLoading();

    try {
      const response = await this.apiService.searchMovies(query, page);

      if (response.Response === "False") {
        alert(
          response.Error ||
            "No movies found. Please try a different search term."
        );
        this.hideLoading();
        return;
      }

      this.appState.setSearchQuery(query);
      this.appState.setSearchResults(
        response.Search,
        parseInt(response.totalResults)
      );
      this.appState.setCurrentPageNumber(page);

      // Update both search inputs
      this.searchInput.value = query;
      this.resultsSearchInput.value = query;

      this.renderResults();
      this.renderPagination();
      this.showPage("results");
    } catch (error) {
      console.error("Search error:", error);
      alert("An error occurred while searching. Please try again.");
    } finally {
      this.hideLoading();
    }
  }

  private renderResults(): void {
    const results = this.appState.getSearchResults();
    this.resultsGrid.innerHTML = "";

    results.forEach((movie) => {
      const movieCard = this.createMovieCard(movie);
      this.resultsGrid.appendChild(movieCard);
    });
  }

  private createMovieCard(movie: Movie): HTMLElement {
    const card = document.createElement("div");
    card.className = "movie-card";
    card.addEventListener("click", () => this.loadMovieDetails(movie.imdbID));

    const posterElement =
      movie.Poster && movie.Poster !== "N/A"
        ? `<img src="${movie.Poster}" alt="${movie.Title}" class="movie-poster" 
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
               <div class="poster-placeholder" style="display: none;">
                   <span>No Poster<br>Available</span>
               </div>`
        : `<div class="poster-placeholder">
                   <span>No Poster<br>Available</span>
               </div>`;

    card.innerHTML = `
            ${posterElement}
            <div class="movie-title">${movie.Title} (${movie.Year})</div>
        `;

    return card;
  }

  private async loadMovieDetails(imdbID: string): Promise<void> {
    this.showLoading();

    try {
      const movieDetail = await this.apiService.getMovieDetails(imdbID);

      if (movieDetail.Response === "False") {
        alert(movieDetail.Error || "Failed to load movie details.");
        this.hideLoading();
        return;
      }

      this.appState.setSelectedMovie(movieDetail);
      this.renderMovieDetails();
      this.showPage("details");
    } catch (error) {
      console.error("Error loading movie details:", error);
      alert("An error occurred while loading movie details. Please try again.");
    } finally {
      this.hideLoading();
    }
  }

  private renderMovieDetails(): void {
    const movie = this.appState.getSelectedMovie();
    if (!movie) return;

    // Set poster
    const posterContainer = this.detailPoster.parentElement;

    // Always ensure placeholder exists
    let placeholder = posterContainer?.querySelector(".poster-placeholder");
    if (!placeholder && posterContainer) {
      placeholder = document.createElement("div");
      placeholder.className = "poster-placeholder";
      placeholder.innerHTML = "<span>No Poster<br>Available</span>";
      posterContainer.appendChild(placeholder);
    }

    if (!movie.Poster || movie.Poster === "N/A") {
      // Hide the original poster image
      this.detailPoster.style.display = "none";

      // Show placeholder
      if (placeholder) {
        (placeholder as HTMLElement).style.display = "flex";
      }
    } else {
      // Set up the poster with error handling
      this.detailPoster.src = movie.Poster;
      this.detailPoster.alt = movie.Title;
      this.detailPoster.style.display = "block";

      // Hide placeholder initially
      if (placeholder) {
        (placeholder as HTMLElement).style.display = "none";
      }

      // Add error handler to show placeholder if image fails to load
      this.detailPoster.onerror = () => {
        this.detailPoster.style.display = "none";
        if (placeholder) {
          (placeholder as HTMLElement).style.display = "flex";
        }
      };

      // Add load handler to ensure image is shown if it loads successfully
      this.detailPoster.onload = () => {
        this.detailPoster.style.display = "block";
        if (placeholder) {
          (placeholder as HTMLElement).style.display = "none";
        }
      };
    }

    // Render movie info
    this.movieInfo.innerHTML = `
            <div class="info-item">
                <div class="info-label">Title</div>
                <div class="info-value">${movie.Title}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Year</div>
                <div class="info-value">${movie.Year}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Country</div>
                <div class="info-value">${movie.Country}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Genres</div>
                <div class="info-value">${movie.Genre}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Language</div>
                <div class="info-value">${movie.Language}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Release Date</div>
                <div class="info-value">${movie.Released}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Runtime</div>
                <div class="info-value">${movie.Runtime}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Director</div>
                <div class="info-value">${movie.Director}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Writer</div>
                <div class="info-value">${movie.Writer}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Actors</div>
                <div class="info-value">${movie.Actors}</div>
            </div>
            <div class="info-item">
                <div class="info-label">IMDb Link</div>
                <div class="info-value">
                    <a href="https://www.imdb.com/title/${movie.imdbID}" target="_blank" class="imdb-link">
                        <svg class="link-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M15 3H21V9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </a>
                </div>
            </div>
        `;

    // Render ratings
    this.ratingsContainer.innerHTML = "";
    movie.Ratings.forEach((rating) => {
      const ratingElement = document.createElement("div");
      ratingElement.className = "rating-item";
      ratingElement.innerHTML = `
                <div class="rating-source">${rating.Source}</div>
                <div class="rating-value">${rating.Value}</div>
            `;
      this.ratingsContainer.appendChild(ratingElement);
    });

    // Set plot
    this.moviePlot.textContent = movie.Plot;
  }

  private renderPagination(): void {
    const totalResults = this.appState.getTotalResults();
    const currentPage = this.appState.getCurrentPageNumber();
    const totalPages = Math.ceil(totalResults / 10); // OMDb returns 10 results per page

    this.pagination.innerHTML = "";

    if (totalPages <= 1) return;

    // Add navigation buttons and page numbers
    this.addPreviousButton(currentPage);
    this.addPageNumbers(currentPage, totalPages);
    this.addNextButton(currentPage, totalPages);
  }

  private addPreviousButton(currentPage: number): void {
    const prevButton = this.createPageButton("‹", false, currentPage === 1);
    if (currentPage > 1) {
      prevButton.addEventListener("click", () =>
        this.performSearch(currentPage - 1)
      );
    }
    this.pagination.appendChild(prevButton);
  }

  private addNextButton(currentPage: number, totalPages: number): void {
    const nextButton = this.createPageButton(
      "›",
      false,
      currentPage === totalPages
    );
    if (currentPage < totalPages) {
      nextButton.addEventListener("click", () =>
        this.performSearch(currentPage + 1)
      );
    }
    this.pagination.appendChild(nextButton);
  }

  private addPageNumbers(currentPage: number, totalPages: number): void {
    if (totalPages <= 5) {
      // Show all pages if 5 or fewer
      this.addSimplePagination(currentPage, totalPages);
    } else {
      // Complex pagination for more than 5 pages
      this.addAdvancedPagination(currentPage, totalPages);
    }
  }

  private addSimplePagination(currentPage: number, totalPages: number): void {
    for (let i = 1; i <= totalPages; i++) {
      this.pagination.appendChild(this.createPageButton(i, i === currentPage));
    }
  }

  private addAdvancedPagination(currentPage: number, totalPages: number): void {
    if (currentPage === 1 || currentPage === 2) {
      // Page 1 or 2: show 1 2 3 ... N
      this.pagination.appendChild(this.createPageButton(1, currentPage === 1));
      this.pagination.appendChild(this.createPageButton(2, currentPage === 2));
      this.pagination.appendChild(this.createPageButton(3, false));
      this.pagination.appendChild(this.createEllipsis());
      this.pagination.appendChild(this.createPageButton(totalPages, false));
    } else if (currentPage === totalPages || currentPage === totalPages - 1) {
      // Page N or N-1: show 1 ... N-2 N-1 N
      this.pagination.appendChild(this.createPageButton(1, false));
      this.pagination.appendChild(this.createEllipsis());
      this.pagination.appendChild(this.createPageButton(totalPages - 2, false));
      this.pagination.appendChild(
        this.createPageButton(totalPages - 1, currentPage === totalPages - 1)
      );
      this.pagination.appendChild(
        this.createPageButton(totalPages, currentPage === totalPages)
      );
    } else if (currentPage === 3) {
      // Page 3: show 1 2 3 4 ... N
      this.pagination.appendChild(this.createPageButton(1, false));
      this.pagination.appendChild(this.createPageButton(2, false));
      this.pagination.appendChild(this.createPageButton(3, true));
      this.pagination.appendChild(this.createPageButton(4, false));
      this.pagination.appendChild(this.createEllipsis());
      this.pagination.appendChild(this.createPageButton(totalPages, false));
    } else if (currentPage === totalPages - 2) {
      // Page N-2: show 1 ... N-3 N-2 N-1 N
      this.pagination.appendChild(this.createPageButton(1, false));
      this.pagination.appendChild(this.createEllipsis());
      this.pagination.appendChild(this.createPageButton(totalPages - 3, false));
      this.pagination.appendChild(this.createPageButton(totalPages - 2, true));
      this.pagination.appendChild(this.createPageButton(totalPages - 1, false));
      this.pagination.appendChild(this.createPageButton(totalPages, false));
    } else {
      // Middle pages (4 to N-3): show 1 ... P-1 P P+1 ... N
      this.pagination.appendChild(this.createPageButton(1, false));
      this.pagination.appendChild(this.createEllipsis());
      this.pagination.appendChild(
        this.createPageButton(currentPage - 1, false)
      );
      this.pagination.appendChild(this.createPageButton(currentPage, true));
      this.pagination.appendChild(
        this.createPageButton(currentPage + 1, false)
      );
      this.pagination.appendChild(this.createEllipsis());
      this.pagination.appendChild(this.createPageButton(totalPages, false));
    }
  }

  private createPageButton(
    page: number | string,
    isActive: boolean = false,
    isDisabled: boolean = false
  ): HTMLButtonElement {
    const button = document.createElement("button");
    button.className = `page-button ${isActive ? "active" : ""}`;
    button.textContent = page.toString();
    button.disabled = isDisabled;

    if (typeof page === "number" && !isDisabled) {
      button.addEventListener("click", () => {
        this.performSearch(page);
      });
    }

    return button;
  }

  private createEllipsis(): HTMLSpanElement {
    const ellipsis = document.createElement("span");
    ellipsis.className = "page-ellipsis";
    ellipsis.textContent = "...";
    return ellipsis;
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  const app = new UIController();
  // Store reference to prevent garbage collection
  (window as any).cinelight = app;
});
