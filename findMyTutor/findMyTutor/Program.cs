using findMyTutor.Repositories;
using findMyTutor.Services;
using findMyTutor.Services.Impl;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendLocal", policy => policy
        .WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
        .WithMethods("POST")
        .AllowAnyHeader());
});

builder.Services.AddSingleton<ProfessorRepository>();
builder.Services.AddScoped<IProfessorServices, ProfessorServicesImpl>();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("FrontendLocal");

app.UseAuthorization();

app.MapControllers();

app.Run();
